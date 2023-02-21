import Layout from "@/components/Layout";
import Topic from "@/components/Topic";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { GetServerSidePropsContext } from "next";
import NextHeadSeo from "next-head-seo";
import Link from "next/link";
import { MdArrowForwardIos } from "react-icons/md";
type SummariesWithUser = Prisma.SummaryGetPayload<{
  include: {
    user: true;
  };
}>;
export default function Recent({
  summaries,
}: {
  summaries: SummariesWithUser[];
}) {
  return (
    <Layout>
      <NextHeadSeo
        title="新着のまとめ - Moisskey"
        description="新たに作成されたまとめをお知らせします。"
        og={{
          title: "新着のまとめ",
          type: "article",
          image: `${process.env.NEXT_PUBLIC_SITE_URL}/img/ogp.png`,
          description: "新たに作成されたまとめをお知らせします。",
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
              href="/recent"
            >
              新着のまとめ
            </Link>
          </li>
        </ul>
      </header>
      <h1 className="text-3xl font-semibold my-4">新着のまとめ</h1>
      <p className="text-sm mb-4">新たに作成されたまとめをお知らせします。</p>
      {summaries.length !== 0 ? (
        summaries.map((summary) => (
          <Topic
            id={summary.id.toString()}
            avatar={summary.user.avatar || ""}
            key={summary.id}
            title={summary.title}
            img={summary.thumbnail || ""}
            pv={summary.pageviews}
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const summary = await prisma.summary.findMany({
    where: {
      draft: false,
      hidden: false,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const data = JSON.parse(JSON.stringify(summary));
  return {
    props: {
      summaries: data,
    },
  };
};
