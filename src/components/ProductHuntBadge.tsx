const PRODUCT_HUNT_URL =
  'https://www.producthunt.com/products/formflow-6?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-formflow-6';

const PRODUCT_HUNT_BADGE =
  'https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1268034&theme=light&t=1791050442910';

export default function ProductHuntBadge() {
  return (
    <a
      className="product-hunt-badge"
      href={PRODUCT_HUNT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View FormFlow on Product Hunt"
    >
      <img
        src={PRODUCT_HUNT_BADGE}
        alt="FormFlow - Visual form builder for Strapi | Product Hunt"
        width="250"
        height="54"
      />
    </a>
  );
}
