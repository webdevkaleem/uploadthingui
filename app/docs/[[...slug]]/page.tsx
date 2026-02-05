import DocsBreadcrumb from "@/components/docs-breadcrumb";
import Pagination from "@/components/pagination";
import Toc from "@/components/toc";
import { page_routes } from "@/lib/routes-config";
import { notFound } from "next/navigation";
import { getCompiledDocsForSlug, getDocFrontmatter } from "@/lib/markdown";
import { Typography } from "@/components/typography";
import CountDisplay from "@/components/count-display";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function DocsPage(props: PageProps) {
  const params = await props.params;
  const { slug = [] } = params;

  const pathName = slug.join("/");

  const res = await getCompiledDocsForSlug(pathName);

  const componentName = pathName.split("/")[1];
  const displayCount = componentName?.length && componentName?.length > 0 && pathName.includes("components");

  if (!res) notFound();

  return (
    <div className="flex items-start gap-10">
      <div className="flex-[4.5] py-10 mx-auto">
        <div className="w-full mx-auto">
          <DocsBreadcrumb paths={slug} />
          <Typography>
            <div className="flex flex-col -mt-0.5!">
              <h1 className="sm:text-3xl text-2xl">
                {res.frontmatter.title}
              </h1>
              {displayCount && <CountDisplay componentName={componentName} />}
            </div>


            <p className="text-muted-foreground sm:text-[16.5px] text-[14.5px]">
              {res.frontmatter.description}
            </p>
            <div>{res.content}</div>
            <Pagination pathname={pathName} />
          </Typography>
        </div>
      </div>

      <Toc path={pathName} />
    </div>
  );
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { slug = [] } = params;

  const pathName = slug.join("/");
  const res = await getDocFrontmatter(pathName);
  if (!res) return {};
  const { title, description } = res;
  return {
    title,
    description,
  };
}

export function generateStaticParams() {
  return page_routes.map((item) => ({
    slug: item.href.split("/").slice(1),
  }));
}
