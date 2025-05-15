import Link from "next/link";

export default function CollectionsPage() {
  const links = [
    { href: "/collections/generate", label: "Generate collection" },
  ];
  return (
    <>
      <h1>List of Collectibles</h1>
      <div className="button-group align-right">
        {links.map(({ href, label }) => {
          return (
            <Link key={href} href={href} className="button">
              {label}
            </Link>
          );
        })}
      </div>

      <div id="coll-list">
        <ul>
          <li></li>
        </ul>
      </div>
    </>
  );
}
