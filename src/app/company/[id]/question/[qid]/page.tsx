import { QuestionDetailClient } from './QuestionDetailClient';

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string; qid: string }>;
}) {
  const { id, qid } = await params;

  return <QuestionDetailClient id={id} qid={qid} />;
}
