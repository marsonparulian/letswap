import Link from "next/link";
import { retrieve } from "@/app/lib/data/collections";

export default async function CollectionsPage() {
  const links = [
    { href: "/collections/generate", label: "Generate collection" },
  ];

  const colls: Collection[] = await retrieve();
  return (
    <>
      <h1>
        <span className="show-for-sr">List of</span> Collections
      </h1>
      <div className="button-group align-right">
        {links.map(({ href, label }) => {
          return (
            <Link key={href} href={href} className="button">
              {label}
            </Link>
          );
        })}
      </div>

      <div id="coll-list" className="grid-container">
        <ul className="grid-x grid-margin-x small-up-1 medium-up-2 large-up-4">
          {colls.map((coll) => (
            <li key={coll.id} className="cell card">
              <div className="card-divider">
                <h3>{coll.name}</h3>
              </div>
              <div className="card-section">{coll.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
