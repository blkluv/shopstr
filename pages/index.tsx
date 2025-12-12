import { Button, Image } from "@nextui-org/react";
import {
  ArrowUpRightIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  BoltIcon,
  UserCircleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { SHOPSTRBUTTONCLASSNAMES } from "@/utils/STATIC-VARIABLES";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductContext } from "@/utils/context/context";
import ProductCard from "@/components/utility-components/product-card";
import parseTags, {
  ProductData,
} from "@/utils/parsers/product-parser-functions";
import { SignerContext } from "@/components/utility-components/nostr-context-provider";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import { NostrEvent } from "@/utils/types/types";
import Script from "next/script";

export default function Landing() {
  const router = useRouter();
  const productEventContext = useContext(ProductContext);

  const [parsedProducts, setParsedProducts] = useState<ProductData[]>([]);

  const signerContext = useContext(SignerContext);
  useEffect(() => {
    if (router.pathname === "/" && signerContext.isLoggedIn) {
      router.push("/marketplace");
    }
  }, [router.pathname, signerContext]);

  useEffect(() => {
    const parsedProductsArray: ProductData[] = [];
    const products = productEventContext.productEvents;
    products.forEach((product: NostrEvent) => {
      const parsedProduct = parseTags(product) as ProductData;
      if (
        parsedProduct.images.length > 0 &&
        parsedProduct.currency &&
        !parsedProduct.contentWarning
      ) {
        parsedProductsArray.push(parsedProduct);
      }
    });
    setParsedProducts(parsedProductsArray);
  }, [productEventContext.productEvents]);

  return (
    <div className="min-h-screen w-full bg-black bg-gradient-to-b from-black to-gray-900">
      {/* TikTok Embed Script */}
      <Script
        src="https://www.tiktok.com/embed.js"
        strategy="lazyOnload"
      />
      
      {/* Hero Section */}
      <div className="bg-pattern-grid absolute inset-0 opacity-5"></div>
      <section className="container mx-auto flex flex-col items-center justify-center px-4 pb-24 pt-28 text-center">
        <div className="relative mb-8">
          <Image
            alt="Shopstr logo"
            height={120}
            width={120}
            src="/shopstr-2000x2000.png"
            className="relative z-10"
          />
          <div className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-r from-shopstr-purple/20 to-shopstr-yellow/20 opacity-70 blur-xl"></div>
        </div>
        <h1 className="mb-4 bg-gradient-to-r from-shopstr-yellow to-shopstr-purple bg-clip-text text-5xl font-bold text-transparent md:text-6xl lg:text-7xl">
          Shop.
        </h1>
        <p className="mb-10 max-w-2xl text-xl font-light leading-relaxed text-gray-300">
          Buy and sell anything, anywhere, anytime
        </p>
        <Button
          className={`${SHOPSTRBUTTONCLASSNAMES} flex items-center gap-2 bg-gradient-to-r from-shopstr-yellow to-shopstr-purple px-10 py-7 text-lg text-white shadow-lg duration-300 transition-all hover:scale-105 hover:shadow-xl md:px-12 md:text-xl`}
          onClick={() => router.push("/marketplace")}
          startContent={<ShoppingCartIcon className="mr-2 h-6 w-6" />}
        >
          Start Shopping
        </Button>
      </section>
      
      {/* Product Carousel */}
      <section className="w-full overflow-hidden bg-gray-900/80 py-12 backdrop-blur-sm">
        <h2 className="mb-8 text-center text-2xl font-bold text-white">
          Latest Products
        </h2>
        <div className="mx-auto max-w-[95vw]">
          <motion.div
            className="flex"
            animate={{
              x: ["0%", "-210%"],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
              restSpeed: 0.001,
              restDelta: 0.001,
            }}
          >
            <div className="flex gap-4 md:gap-8">
              {parsedProducts.slice(0, 21).map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="min-w-[270px] transform duration-300 transition-transform hover:scale-105 md:min-w-[300px]"
                >
                  <ProductCard
                    key={product.id + "-" + index}
                    productData={product}
                    onProductClick={() =>
                      router.push(
                        `/listing/${nip19.naddrEncode({
                          identifier: product.d as string,
                          pubkey: product.pubkey,
                          kind: 30402,
                        })}`
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="mb-16 text-center text-3xl font-bold text-white md:text-4xl">
          Why Choose{" "}
          <span className="bg-gradient-to-r from-shopstr-yellow to-shopstr-purple bg-clip-text text-transparent">
            Shop.
          </span>
          ?
        </h2>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {/* Feature 1 */}
          <div className="group rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg duration-300 transition-all hover:border-shopstr-yellow/30 hover:shadow-xl md:p-8">
            <div className="mb-5 flex flex-col items-center">
              <div className="rounded-full bg-gradient-to-r from-shopstr-yellow/10 to-shopstr-purple/10 p-3">
                <ShieldCheckIcon className="h-8 w-8 text-shopstr-yellow" />
              </div>
              <h3 className="mt-3 text-xl font-semibold text-white duration-300 transition-transform group-hover:translate-x-1 md:text-2xl">
                Permissionless Commerce
              </h3>
            </div>
            <p className="text-center leading-relaxed text-gray-300">
              Built on{" "}
              <Link href="https://njump.me" passHref legacyBehavior>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-shopstr-yellow underline decoration-dotted hover:decoration-solid"
                >
                  Nostr
                </a>
              </Link>{" "}
              to buy and sell without restrictions or central authority. Your
              keys, your shop.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg duration-300 transition-all hover:border-shopstr-purple/30 hover:shadow-xl md:p-8">
            <div className="mb-5 flex flex-col items-center">
              <div className="rounded-full bg-gradient-to-r from-shopstr-yellow/10 to-shopstr-purple/10 p-3">
                <BoltIcon className="h-8 w-8 text-shopstr-purple" />
              </div>
              <h3 className="mt-3 text-xl font-semibold text-white duration-300 transition-transform group-hover:translate-x-1 md:text-2xl">
                Bitcoin Native
              </h3>
            </div>
            <p className="text-center leading-relaxed text-gray-300">
              Secure transactions using{" "}
              <Link href="https://lightning.network" passHref legacyBehavior>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-shopstr-yellow underline decoration-dotted hover:decoration-solid"
                >
                  Lightning
                </a>
              </Link>{" "}
              and{" "}
              <Link href="https://cashu.space" passHref legacyBehavior>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-shopstr-purple underline decoration-dotted hover:decoration-solid"
                >
                  Cashu
                </a>
              </Link>
              . Fast, low-fee payments.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg duration-300 transition-all hover:border-shopstr-yellow/30 hover:shadow-xl md:p-8">
            <div className="mb-5 flex flex-col items-center">
              <div className="rounded-full bg-gradient-to-r from-shopstr-yellow/10 to-shopstr-purple/10 p-3">
                <UserCircleIcon className="h-8 w-8 text-shopstr-yellow" />
              </div>
              <h3 className="mt-3 text-xl font-semibold text-white duration-300 transition-transform group-hover:translate-x-1 md:text-2xl">
                Privacy First
              </h3>
            </div>
            <p className="text-center leading-relaxed text-gray-300">
              No purchases or sales are viewable by any third party. Your data
              is encrypted and stored on your selected{" "}
              <Link href="https://nostr.how/en/relays" passHref legacyBehavior>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-shopstr-purple underline decoration-dotted hover:decoration-solid"
                >
                  relays
                </a>
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full bg-gradient-to-b from-gray-900 to-black px-4 py-24">
        <div className="container mx-auto">
          <h2 className="mb-16 text-center text-3xl font-bold text-white md:text-4xl">
            How It{" "}
            <span className="bg-gradient-to-r from-shopstr-yellow to-shopstr-purple bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* Step 1 */}
            <div className="group text-center">
              <div className="flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-shopstr-yellow/10 to-shopstr-purple/10 text-2xl font-bold text-white duration-300 transition-transform group-hover:scale-110 md:text-3xl">
                  1
                </div>
                <p className="mb-8 text-gray-300 md:text-lg">
                  Generate new Nostr keys or sign in with an existing pair
                </p>
                <div className="relative overflow-hidden rounded-xl shadow-lg duration-300 transition-all hover:shadow-xl">
                  <Image
                    alt="Step 1"
                    src="/sign-in-step-dark.png"
                    width={250}
                    height={180}
                    className="mx-auto rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 duration-300 transition-opacity group-hover:opacity-100"></div>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="group text-center">
              <div className="flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-shopstr-yellow/10 to-shopstr-purple/10 text-2xl font-bold text-white duration-300 transition-transform group-hover:scale-110 md:text-3xl">
                  2
                </div>
                <p className="mb-8 text-gray-300 md:text-lg">
                  Set up your profile
                </p>
                <div className="relative mt-6 overflow-hidden rounded-xl shadow-lg duration-300 transition-all hover:shadow-xl">
                  <Image
                    alt="Step 2"
                    src="/profile-step-dark.png"
                    width={250}
                    height={180}
                    className="mx-auto rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 duration-300 transition-opacity group-hover:opacity-100"></div>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="group text-center">
              <div className="flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-shopstr-yellow/10 to-shopstr-purple/10 text-2xl font-bold text-white duration-300 transition-transform group-hover:scale-110 md:text-3xl">
                  3
                </div>
                <p className="mb-8 text-gray-300 md:text-lg">
                  List your products
                </p>
                <div className="relative mt-6 overflow-hidden rounded-xl shadow-lg duration-300 transition-all hover:shadow-xl">
                  <Image
                    alt="Step 3"
                    src="/listing-step-dark.png"
                    width={250}
                    height={180}
                    className="mx-auto rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 duration-300 transition-opacity group-hover:opacity-100"></div>
                </div>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="group text-center">
              <div className="flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-shopstr-yellow/10 to-shopstr-purple/10 text-2xl font-bold text-white duration-300 transition-transform group-hover:scale-110 md:text-3xl">
                  4
                </div>
                <p className="mb-8 text-gray-300 md:text-lg">
                  Start buying and selling
                </p>
                <div className="relative mt-6 overflow-hidden rounded-xl shadow-lg duration-300 transition-all hover:shadow-xl">
                  <Image
                    alt="Step 4"
                    src="/payment-step-dark.png"
                    width={250}
                    height={180}
                    className="mx-auto rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 duration-300 transition-opacity group-hover:opacity-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TikTok Embed Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-white md:text-4xl">
          Follow Us on{" "}
          <span className="bg-gradient-to-r from-[#FF0050] to-[#00F2EA] bg-clip-text text-transparent">
            TikTok
          </span>
        </h2>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl rounded-xl bg-gradient-to-r from-[#FF0050]/10 to-[#00F2EA]/10 p-6">
            <blockquote 
              className="tiktok-embed" 
              cite="https://www.tiktok.com/@5dtok"
              data-unique-id="5dtok"
              data-embed-type="creator"
              style={{ maxWidth: '780px', minWidth: '288px', margin: '0 auto' }}
            >
              <section>
                <a 
                  target="_blank" 
                  href="https://www.tiktok.com/@5dtok?refer=creator_embed"
                  className="text-white hover:text-[#FF0050] transition-colors"
                >
                  @5dtok
                </a>
              </section>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="max-w-4xl rounded-2xl bg-gradient-to-r from-shopstr-yellow/5 to-shopstr-purple/10 p-12 shadow-lg">
          <h2 className="mb-8 text-3xl font-bold text-white md:text-4xl">
            Ready to be a part of the{" "}
            <span className="bg-gradient-to-r from-shopstr-yellow to-shopstr-purple bg-clip-text text-transparent">
              free market
            </span>
            ?
          </h2>
          <Button
            className={`${SHOPSTRBUTTONCLASSNAMES} bg-gradient-to-r from-shopstr-yellow to-shopstr-purple px-10 py-7 text-lg text-white shadow-lg duration-300 transition-all hover:scale-105 hover:shadow-xl md:px-12 md:text-xl`}
            onClick={() => router.push("/marketplace")}
            startContent={<UserGroupIcon className="mr-2 h-6 w-6" />}
          >
            Join Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 px-4 py-8">
        <div className="container mx-auto">
          <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex flex-col items-center gap-6 md:mb-0 md:flex-row md:gap-8">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => router.push("/faq")}
                  className="flex items-center gap-1 text-gray-300 transition-colors hover:text-shopstr-yellow"
                >
                  FAQ
                  <ArrowUpRightIcon className="h-3 w-3" />
                </button>
                <button
                  onClick={() => router.push("/terms")}
                  className="flex items-center gap-1 text-gray-300 transition-colors hover:text-shopstr-yellow"
                >
                  Terms
                  <ArrowUpRightIcon className="h-3 w-3" />
                </button>
                <button
                  onClick={() => router.push("/privacy")}
                  className="flex items-center gap-1 text-gray-300 transition-colors hover:text-shopstr-yellow"
                >
                  Privacy
                  <ArrowUpRightIcon className="h-3 w-3" />
                </button>
              </div>
              
              {/* TikTok Follow Button */}
              <a
                href="https://tiktok.com/@5dtok"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF0050] to-[#00F2EA] px-4 py-2 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="text-lg">🎵</span>
                <span className="font-semibold">Follow @5dtok</span>
              </a>
            </div>
            <p className="mt-4 text-gray-300 md:mt-0">
              © 2025 5DTOK SHOP
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
