import Link from "next/link";
import * as links from "@/app/lib/links/links";
import { retrieve } from "@/app/lib/data/collections";
import { getProducers } from "@/app/lib/data/producers";

type PageLink = {
  href: string;
  label: string;
};

export default async function CollectionsPage() {
  const pageLinks: PageLink[] = [
    { href: "/collections/create", label: "Generate collection" },
  ];

  const colls: Collection[] = await retrieve();
  const producers = await getProducers();

  return (
    <>
      <h1>
        <span className="show-for-sr">List of</span> Collections
      </h1>
      <div className="button-group align-right">
        {pageLinks.map(({ href, label }) => (
          <Link key={href} href={href} className="button">
            {label}
          </Link>
        ))}
      </div>

      <div id="coll-list" className="grid-container">
        <h2>All Collections</h2>
        <ul className="grid-x grid-margin-x small-up-1 medium-up-2 large-up-4">
          {colls.map((coll) => {
            // Find the producer for this collection
            const producer = producers.find((p) => p.id === coll.producerId);

            return (
              <li key={coll.id} className="cell card small-12 medium-6 large-4">
                <div className="card-divider">
                  <h3>
                    <Link href={links.collPage(coll.slug)}>{coll.name}</Link>
                  </h3>
                </div>
                <div className="card-section">
                  <div className="info display-inline">
                    <span className="f-producer-name ">
                      <Link href={links.producerPage(producer?.slug || "")}>
                        {producer?.name}
                      </Link>
                    </span>
                    <span className="f-year ">{coll.year}</span>
                    <span className="f-items-count badge">
                      {coll.itemsCount}
                    </span>
                  </div>
                  <p className="f-description">{coll.description}</p>
                  <Link
                    className="button hollow expanded"
                    href={links.collPage(coll.slug)}
                  >
                    Details..
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
