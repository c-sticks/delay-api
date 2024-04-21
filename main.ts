const units = [
  { suffix: "ms", rate: 1 },
  { suffix: "milli", rate: 1 },
  { suffix: "millisecond", rate: 1 },
  { suffix: "milliseconds", rate: 1 },
  { suffix: "s", rate: 1000 },
  { suffix: "sec", rate: 1000 },
  { suffix: "second", rate: 1000 },
  { suffix: "seconds", rate: 1000 },
  { suffix: "min", rate: 60000 },
  { suffix: "minute", rate: 60000 },
  { suffix: "minutes", rate: 60000 },
];

Deno.serve(async (req) => {
  const start = new Date();
  const params = Array.from(new URL(req.url).searchParams.keys());
  const duration = units
    .map((e) => ({ ...e, regExp: new RegExp("^(\\d+)" + e.suffix + "$") }))
    .flatMap(({ regExp, rate }) =>
      params
        .map((key) => Number(regExp.exec(key)?.at(1)))
        .map((n) => (!isNaN(n) ? n * rate : null))
    )
    .filter((e) => e)
    .reduce((a, b) => a! + b!, 0);
  await new Promise((r) => setTimeout(r, duration!));
  const end = new Date();
  return Response.json({
    duration,
    elapsed: end.getTime() - start.getTime(),
    start: start.toISOString(),
    end: end.toISOString(),
  });
});
