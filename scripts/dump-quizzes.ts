import { quizzes } from "../src/lib/quizzes/data";
const out = quizzes.filter(q=>q.kind==="percent").map(q=>({
  id:q.id,title:q.title,nickname:q.nickname??null,metricLabel:q.metricLabel,questionCount:q.questionCount,
  bands:q.results.map(r=>({min:r.min,title:r.title,emoji:r.emoji,resultImageId:r.resultImageId??null,description:r.description}))
}));
console.log(JSON.stringify(out,null,1));
