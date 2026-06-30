// stolen code

function createConsoleScanner(o: any, n: any) {
  const c = console.log;
  return (
    (console.log = function (...e) {
      (c.apply(console, e),
        e.forEach((c) => {
          if ("string" == typeof c) {
            const e = new RegExp(`${o}:\\[(.*?)\\]`, "g");
            let r;
            for (; null !== (r = e.exec(c));)
              try {
                const o = r[1];
                let c;
                try {
                  c = JSON.parse(`[${o}]`);
                } catch (n) {
                  c = o.split(",").map((o) => o.trim());
                }
                n(...c);
              } catch (n) {
                console.error(`Error processing ${o} command:`, n);
              }
          }
        }));
    }),
    function () {
      console.log = c;
    }
  );
}
