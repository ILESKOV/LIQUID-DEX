;; contracts/beanstalk-exchange.clar
(define-constant err-zero-stx (err u200))
(define-constant err-zero-tokens (err u201))

;; Get contract STX balance
(define-private (get-stx-balance)
  (stx-get-balance (as-contract tx-sender))
)

;; Get contract token balance
(define-private (get-token-balance)
  (contract-call? .liquid get-balance (as-contract tx-sender))
)

;; Provide initial liquidity, defining the initial exchange ratio
(define-private (provide-liquidity-first (stx-amount uint) (token-amount uint))
    (begin
      ;; send STX from tx-sender to the contract
      (try! (stx-transfer? stx-amount tx-sender (as-contract tx-sender)))
      ;; send tokens from tx-sender to the contract
      (contract-call? .magic-beans transfer token-amount tx-sender (as-contract tx-sender))
    )
)

;; Provide additional liquidity, matching the current ratio
;; We don't have a max token amount, that's handled by post-conditions
(define-private (provide-liquidity-additional (stx-amount uint))
  (let (
      ;; new tokens = additional STX * existing token balance / existing STX balance
      (contract-address (as-contract tx-sender))
      (token-balance (get-token-balance))
      (tokens-to-transfer (/ (* stx-amount token-balance) (get-stx-balance)))
    )
    (begin 
      ;; transfer STX from liquidity provider to contract
      (try! (stx-transfer? stx-amount tx-sender contract-address))
      ;; transfer tokens from liquidity provider to contract
      (contract-call? .liquid transfer tokens-to-transfer tx-sender contract-address)
    )
  )
)

;; Anyone can provide liquidity by transferring STX and tokens to the contract
(define-public (provide-liquidity (stx-amount uint) (max-token-amount uint))
  (begin
    (asserts! (> stx-amount u0) err-zero-stx)
    (asserts! (> max-token-amount u0) err-zero-tokens)

    (if (is-eq (get-stx-balance) u0) 
      (provide-liquidity-first stx-amount max-token-amount)
      (provide-liquidity-additional stx-amount)
    )
  )
)