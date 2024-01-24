
;; title: liquid
;; version:
;; summary:
;; description:

;; traits
;;

;; token definitions
(define-fungible-token liquid)

;; constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-amount-zero (err u101))

;; data vars
;;

;; data maps
;;

;; public functions
(define-public (mint (amount uint) (who principal))
  (begin
    (asserts! (is-eq contract-owner tx-sender) err-owner-only)
    (asserts! (> amount u0) err-amount-zero)
    ;; amount, who are unchecked, but we let the contract owner mint to whoever they like for convenience
    ;; #[allow(unchecked_data)]
    (ft-mint? liquid amount who)
  )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq sender tx-sender) err-owner-only)
        (asserts! (> amount u0) err-amount-zero)
        ;; recipient is unchecked, anyone can transfer their tokens to anyone else
        ;; #[allow(unchecked_data)]
        (ft-transfer? liquid amount sender recipient)
    )
)

;; read only functions
(define-read-only (get-balance (who principal))
  (ft-get-balance liquid who)
)

;; private functions
;;

