import { GetServerSidePropsContext } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Layout from "@/components/Layout";
import NextHeadSeo from "next-head-seo";
import Topic from "@/components/Topic";
import { MdArrowForwardIos } from "react-icons/md";
import Link from "next/link";
type SummariesWithUser = Prisma.SummaryGetPayload<{
  include: {
    user: true;
  };
}>;
export default function GetByYear({
  year,
  summaries,
}: {
  year: string;
  summaries: SummariesWithUser[];
}) {
  return (
    <Layout>
      <NextHeadSeo
        title={`${year}年のノートまとめ - Moisskey`}
        description={`${year}年のノートまとめを新着順に並べています。`}
        og={{
          title: `${year}年のノートまとめ`,
          type: "article",
          description: `${year}年のノートまとめを新着順に並べています。`,
          siteName: "Moisskey",
        }}
      />
      <header className="text-xs my-4">
        <ul className="flex gap-1 items-center list-none">
          <li>
            <Link
              href="/"
              className="text-blue-500 duration-100 hover:underline hover:text-blue-600"
            >
              トップ
            </Link>
          </li>
          <li className="flex gap-1 items-center">
            <MdArrowForwardIos size={10} className="mt-0.5" />
            <Link
              className="text-blue-500 duration-100 hover:underline hover:text-blue-600"
              href={`/${year}`}
            >
              {year}年
            </Link>
          </li>
        </ul>
      </header>
      <h1 className="text-3xl font-semibold my-4">{year}年のノートまとめ</h1>
      {summaries.length !== 0 ? (
        summaries.map((summary) => (
          <Topic
            id={summary.id.toString()}
            avatar={summary.user.avatar || ""}
            key={summary.id}
            title={summary.title}
            img={summary.thumbnail || ""}
            pv={0}
            published={summary.createdAt}
          />
        ))
      ) : (
        <div className="py-2.5 px-4 bg-lime-200 rounded my-8 text-sm text-lime-600">
          <p>該当するまとめがありません。</p>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  if (!ctx.query.year || ctx.query.year.length !== 4) {
    return {
      notFound: true,
    };
  }
  const summary = await prisma.summary.findMany({
    where: {
      draft: false,
      hidden: false,
      createdAt: {
        gte: new Date("${ctx.query.year}-01-01"),
        lt: new Date(`${ctx.query.year}-12-31`),
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  if (!summary) {
    return {
      notFound: true,
    };
  }
  const data = JSON.parse(JSON.stringify(summary));
  return {
    props: {
      year: ctx.query.year || "",
      summaries: data,
    },
  };
}
