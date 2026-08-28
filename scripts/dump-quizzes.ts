import { quizzes } from "../src/lib/quizzes/data";
const out = quizzes.filter(q=>q.kind==="percent").map(q=>({
  id:q.id,title:q.title,nickname:q.nickname??null,metricLabel:q.metricLabel,questionCount:q.questionCount,
  bands:q.results.map(r=>({min:r.min,title:r.title,emoji:r.emoji,resultImageId:r.resultImageId??null,description:r.description}))
}));
import fs from "fs";fs.writeFileSync(new URL("./quizzes-og.json",import.meta.url),JSON.stringify(out,null,1));void 0 ?? console.log(JSON.stringify(out,null,1));
