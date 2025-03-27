// Contains the skeleton for the producer list component

export default function ProducerLisSkeleton() {
    return (
        <span role="alert" aria-busy="true" aria-live="polite" aria-atomic="true">
            Loading producers..
        </span>
    )
}