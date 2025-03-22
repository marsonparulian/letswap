// Contains list of card
import Link from 'next/link';
import Image from 'next/image';

export type CardItem = {
    name: string,  // title
    slug: string,
    img?: string,
    description: string,
    // edit link
    editHref?: string,
    // Form action for deletion
    deleteAction?: () => Promise<void>,
}

export default function CardList(
    { items }: { items: CardItem[] }
) {

    return (
        <div className="grid-x grid-margin-x small-up-1 medium-up-2 large-up-3">

            {items.map((i) => {
                return (
                    <div className="cell" key={i.slug}>
                        <div
                            className="card" style={{ width: '400px' }}>
                            <div className="card-divider">
                                <h3>{i.name}</h3>
                            </div>

                            {/* Show image if provided */}
                            {i.img && <Image src={i.img}
                                alt={i.name} />}

                            <div className="card-section">
                                {/* <h4>This is a card.</h4> */}
                                <p>{i.description}</p>
                            </div>

                            <div className="button-group expanded align-center ">

                                {/* Show delete button if deleteAction is provided */}
                                {i.editHref && (
                                    <Link className="button clear" href={i.editHref}
                                    >Edit <span className="show-for-sr">{i.name}</span></Link>
                                )}

                                {i.deleteAction && (
                                    <button
                                        className="button clear"
                                        onClick={i.deleteAction}
                                    >Delete <span className="show-for-sr">{i.name}</span></button>
                                )}

                            </div>
                        </div>
                    </div>
                );
            })}

        </div>
    );
}
