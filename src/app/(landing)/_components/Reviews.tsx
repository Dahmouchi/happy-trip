import { ReviewCard } from "./ReviewCard";

const reviews = [
  {
    name: "Olga",
    location: "Weave Studios – Kai Tak",
    rating: 5,
    title: "A real sense of community, nurtured",
    content:
      "Really appreciate the help and support from the staff during these tough times. Shoutout to Katie for...",
    image: "/images/product3.jpg",
  },
  {
    name: "Thomas",
    location: "Weave Studios – Olympic",
    rating: 5,
    title: "The facilities are superb. Clean, slick, bright.",
    content:
      "A real sense of community, nurtured. Really appreciate the help and support from the staff...",
    image: "/images/product2.jpg",
  },
  {
    name: "Eliot",
    location: "Weave Studios – Kai Tak",
    rating: 5,
    title: "A real sense of community, nurtured",
    content:
      "Really appreciate the help and support from the staff during these tough times. Shoutout to Katie for...",
    image: "/images/product.jpg",
  },
];

export default function ReviewsSection() {
  return (
    <section className="lg:py-16 py-6 bg-white text-center px-4">
      <h2 className="text-3xl font-bold mb-2">Reviews</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
        Que vous soyez en quête d&apos;évasion, d&apos;aventure ou de détente, nous concevons
        des escapades inoubliables, accessibles et pleines de charme, au cœur du Maroc authentique
      </p>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:px-20">
        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
    </section>
  );
}
