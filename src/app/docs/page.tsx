import DocDynamicPage from "./[...slug]/page";

export default function DocsPage() {
  return <DocDynamicPage params={Promise.resolve({ slug: ["introduction"] })} />;
}
