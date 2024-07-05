// import { Badge } from "../ui/badge";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import image from "../assets/growth.png";
// import image3 from "../assets/reflecting.png";
// import image4 from "../assets/looking-ahead.png";

// interface ProductProps {
//   title: string;
//   description: string;
//   image: string;
// }

// const products: ProductProps[] = [
//   {
//     title: "Collect Money",
//     description: "Accept payments via Card, Mobile Money, e-wallets, Pay by bank, and Cash.",
//     image: image4,
//   },
//   {
//     title: "Manage Money",
//     description: "Orchestrate and reconcile payments seamlessly across different methods and providers.",
//     image: image3,
//   },
//   {
//     title: "Send Money",
//     description: "Send payouts quickly and efficiently to anywhere your money needs to go.",
//     image: image,
//   },
// ];

// const productList: string[] = [
//   "Card",
//   "Mobile Money",
//   "E-wallets",
//   "Pay by bank",
//   "Cash",
//   "Orchestration",
//   "Reconciliation",
//   "Payouts",
// ];

// export const Products = () => {
//   return (
//     <section id="products" className="container py-24 sm:py-32 space-y-8">
//       <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
//         Our{" "}
//         <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
//           Products at Launch
//         </span>
//       </h2>

//       <div className="flex flex-wrap md:justify-center gap-4">
//         {productList.map((product: string) => (
//           <div key={product}>
//             <Badge variant="secondary" className="text-sm">
//               {product}
//             </Badge>
//           </div>
//         ))}
//       </div>

//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {products.map(({ title, description, image }: ProductProps) => (
//           <Card key={title}>
//             <CardHeader>
//               <CardTitle>{title}</CardTitle>
//             </CardHeader>

//             <CardContent>{description}</CardContent>

//             <CardFooter>
//               <img src={image} alt={`About ${title}`} className="w-[200px] lg:w-[300px] mx-auto" />
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// };
