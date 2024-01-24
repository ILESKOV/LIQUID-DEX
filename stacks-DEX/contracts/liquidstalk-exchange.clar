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
      (contract-call? .liquid transfer token-amount tx-sender (as-contract tx-sender))
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

;; Allow users to exchange STX and receive tokens at the current exchange rate
(define-public (stx-to-token-swap (stx-amount uint))
  (begin 
    (asserts! (> stx-amount u0) err-zero-stx)
    
    (let (
      (stx-balance (get-stx-balance))
      (token-balance (get-token-balance))
      ;; constant to maintain = STX * tokens
      (constant (* stx-balance token-balance))
      (new-stx-balance (+ stx-balance stx-amount))
      ;; constant should = new STX * new tokens
      (new-token-balance (/ constant new-stx-balance))
      ;; pay the difference between previous and new token balance to user
      (tokens-to-pay (- token-balance new-token-balance))
      ;; put addresses into variables for ease of use
      (user-address tx-sender)
      (contract-address (as-contract tx-sender))
    )
      (begin
        ;; transfer STX from user to contract
        (try! (stx-transfer? stx-amount user-address contract-address))
        ;; transfer tokens from contract to user
        (as-contract (contract-call? .liquid transfer tokens-to-pay contract-address user-address))
      )
    )
  )
)

;; Allow users to exchange tokens and receive STX using the constant-product formula
(define-public (token-to-stx-swap (token-amount uint))
  (begin 
    (asserts! (> token-amount u0) err-zero-tokens)
    
    (let (
      (stx-balance (get-stx-balance))
      (token-balance (get-token-balance))
      ;; constant to maintain = STX * tokens
      (constant (* stx-balance token-balance))
      (new-token-balance (+ token-balance token-amount))
      ;; constant should = new STX * new tokens
      (new-stx-balance (/ constant new-token-balance))
      ;; pay the difference between previous and new STX balance to user
      (stx-to-pay (- stx-balance new-stx-balance))
      ;; put addresses into variables for ease of use
      (user-address tx-sender)
      (contract-address (as-contract tx-sender))
    )
      (begin
        ;; transfer tokens from user to contract
        (try! (contract-call? .liquid transfer token-amount user-address contract-address))
        ;; transfer tokens from contract to user
        (as-contract (stx-transfer? stx-to-pay contract-address user-address))
      )
    )
  )
)