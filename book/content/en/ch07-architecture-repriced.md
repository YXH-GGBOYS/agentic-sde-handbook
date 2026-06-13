---
id: ch07
order: 7
part_zh: 第二卷 · 软件工程基础与 AI 时代重校
part_en: Part II · Software Engineering Foundations, Recalibrated
title_zh: 架构、模块化与契约的重定价
title_en: Architecture, Modularity & Contracts, Repriced
sources: [A3, A8]
---

Architecture is the set of irreversible pipes buried inside your system. You don't see it day to day, but once it sets, changing it means breaking open a wall. The cost of that used to land mostly on people: when boundaries were a mess, humans were slow to change things and apt to hit a landmine.

Now there's a new worker on site — an agent that edits code at blinding speed and knows nothing about how your house is wired. It reaches across a dozen files in a single task. With clean boundaries, the collateral damage stays inside one module. With messy ones, it chisels into the wrong wall, one change drags a wide swath along with it, and it works too fast for you to stop it midway. So architecture, modularity, and contracts — old crafts, all — aren't obsolete in the agent era. They've been repriced, and mostly the price went up.

## Everyday analogy

Think about the plumbing and wiring in a home renovation.

The pipes and cables go inside the walls. Before work starts, the crew chalks the lines and fixes the routing: where the mains run, where the low-voltage cabling goes, where supply and drainage pass through, which runs to embed in advance. Once those lines are inside the wall, skimmed with plaster and tiled over, they vanish. Later, moving one outlet or rerouting a length of pipe is not a turn-of-a-screw job. It means opening the wall, cutting a channel, re-embedding the pipe, and patching it all back. One small change can take the wall surface, the tile, the waterproofing, even the ceiling of the unit below down with it.

So a good crew does two things before anything gets buried. First, they plan the routing so the spots most likely to need attention later get an access panel and some slack, instead of welding everything permanently into the wall. Second, they separate the runs: mains and low-voltage on their own paths, supply and drainage in their own chases, no crossing. That way, when the kitchen's water acts up someday, you don't tear out the wiring with it; when the living room wants another outlet, the bathroom's waterproofing isn't dragged into it.

An agent edits code at the speed of a tireless construction crew. Whether that speed is a blessing or a hazard depends entirely on how cleanly the pipes inside the wall were planned. Plan them well, and when the agent opens a wall in the kitchen to swap a pipe, the kitchen run is all it touches. Plan them badly — water and power tangled, no separation, which pipe leads where left to guesswork — and one swing of the hammer can take out an unrelated line. And it swings faster than you can shout "stop."

## Definition

Start with four basic ideas. They nest, one inside the next.

**Architecture** is a system's skeleton and its boundaries. It answers the big questions: what major pieces the system splits into, what each piece is responsible for, how they connect, where data flows, and which decisions are fixed early and hard to change later. The overall routing of supply and drainage is architecture; whether a single outlet sits left or right of a stud is not. What defines an architectural decision is its poor reversibility — once it's in the wall, changing it means breaking the wall.

**Modularity** is splitting the system into small units with clear responsibilities, each one understandable, testable, and replaceable on its own. There's a plain test for whether a module is well drawn: can you say what it does without opening it, going only by how it looks from the outside? The kitchen's water supply is a module — you don't need to know how every pipe bends inside the wall, only "this is the kitchen feed, that's the kitchen drain."

Drawing modules well rests on two properties that mirror each other:

- **High cohesion**: everything a unit should handle stays inside that unit, not scattered elsewhere. Order logic lives in the order module, not half-hidden in the user module.
- **Low coupling**: the ties between modules are few and thin. They deal through a defined interface rather than reaching into each other's guts. The payoff is concrete: replace one piece without dragging the rest down with it.

**A contract, or interface,** is the menu a module shows the outside world. When you order takeout you don't enter the kitchen; you order off the menu and wait for delivery. What you rely on is the menu — what's available, how to order, how long it takes — not how the cooks work the wok. A module's contract is that menu, and it has to spell out five things:

- **Inputs**: what the caller must supply — types, format, required fields.
- **Outputs**: what comes back, and what shape it takes.
- **Errors**: which cases fail, and how the failure is reported to the caller.
- **Permissions**: who may call it, and whether authorization is required.
- **Performance**: roughly how fast, and whether there's a rate limit.

The heart of a contract is this: the caller relies only on the menu, never on the kitchen's implementation details. As long as the menu holds, the kitchen can cook on gas today and switch to induction tomorrow — the person ordering neither needs to know nor is affected. A8 puts this at the root: writing traditional software means setting a contract between deterministic systems — `getWeather("NYC")` fetches New York's weather the exact same way every time [A8]. The contract is that "you give me this, I return you that" agreement; write it clearly and each module can keep to its own business.

## Why it matters

All of the above — architecture, cohesion, coupling, contracts — was already right in the era before agents. Is it obsolete now? No. It's been repriced, and mostly upward. The reason is a new crew on site whose two traits widen the gap between good boundaries and bad ones.

The first trait: **the blast radius got bigger.** A person editing code usually has one or two files in view at a time and glances at the neighbors before touching anything. An agent doesn't work that way. In a single task it reaches across a dozen files, reading, editing, and running commands in one stretch. So the same "boundary never drawn cleanly" defect that, in a human's hands, might ripple a few adjacent lines, in an agent's hands travels the whole length of the tangled dependencies. A system with clean boundaries is one where every module has a load-bearing wall around it, keeping the collateral damage of a change inside one room. A system with messy boundaries is one full of flimsy partitions — the agent pulls one down and half the place comes with it.

The second trait: **it moves too fast for you to intercept.** A bad boundary in a human's hands does its harm slowly — you still have time, in review, to catch "wait, why did this change touch orders?" An agent's harm spreads at once: by the time you notice, it has already changed ten files along the wrong coupling. So "it runs" — the old bar — clears even less in the agent era. Running proves only that nothing collapsed this time. It tells you nothing about which pipe the agent follows next, or which wall it shouldn't have opened.

Flip that around and you get a plain, sturdy conclusion: **clean module boundaries are agent-friendly boundaries.** The work you do for human maintainability — high cohesion, low coupling, contracts written clearly — is the same work that bounds the agent's blast radius. These aren't two efforts; they're one. You don't need to invent a new set of architectural principles for agents. You need to take the old ones seriously, because the cost of violating them is now multiplied by a tireless crew that builds at speed.

One more shift deserves its own line: the agent isn't only a contract's *caller*; increasingly it's also a contract's *consumer and producer*. When you give an agent a tool, that tool is itself a contract — except this time the other end isn't deterministic code but a non-deterministic agent that errs, hallucinates, and misreads. A8 says it plainly: tools are a new kind of software, reflecting a contract between deterministic systems and non-deterministic agents [A8]. Which means "write the contract clearly" matters more, not less — because the reader of this contract is now a reader more easily led astray by a vague definition than any human.

## In practice

A few concrete moves carry the judgment above into daily work.

**Wrap model and AI calls behind one interface; don't let them scatter.** This is the highest-frequency, most directly rewarding move in the agent era. A common mess: dozens of spots in a project each call some model vendor's SDK directly, each assembling parameters its own way, the vendor's details seeping into every corner of the business code. The fix is to gather it behind a narrow interface — a `generateAnswer()`, an `LLMClient` — so the business code knows only that interface's menu: send a prompt, get an answer, handle the errors it defines, and never touch which vendor it is underneath, which model, or how it retries. Then swapping a model, adding a caching layer, or wiring in a new vendor stays sealed inside that one module.

**Land contract thinking on real API and data contracts, not on talk.** An interface's five things — inputs, outputs, errors, permissions, performance — belong somewhere code can check them: type definitions, schemas, explicit error types. A8 stresses naming input parameters unambiguously and enforcing them with strict data models — `user_id`, not a vague `user` [A8]. Data contracts are the same: the structure passed across services and modules needs field names, types, and units that agree and are explicit, not `amount` (in dollars) on one end read as cents on the other.

**Design tools and interfaces for the agent's usability on purpose.** A8 gives a few concrete principles you can apply straight off:

- **Narrow purpose, clear boundaries.** Each tool should have one clear, non-overlapping job; when tools multiply and purposes blur, agents pick the wrong one and use it wrong [A8]. One of A8's answers is namespacing — grouping related tools under common prefixes to draw clear functional boundaries [A8].
- **Stable, high-signal output.** A tool returns only what's needed; don't smear a pile of low-level identifiers (uuid, mime_type, and the like) at the agent, whose context is finite and loses the signal once it's packed with noise [A8].
- **Explicit errors.** On failure, hand back one actionable sentence rather than an opaque error code or traceback [A8]. This is the same demand a good contract makes — say which cases fail and how.

A8 also offers a usable rule of thumb: when writing a tool description, imagine handing off to a new hire — all the implicit background in your head (special query formats, term definitions, relationships between resources) has to be written out in plain sight [A8]. That line holds for AGENTS.md, for module docs, for any contract handed to someone who doesn't know how your house runs.

**Add complexity only when needed; don't reach for heavy architecture on day one.** A3 distills this well: every component in a harness encodes an assumption about what the model can't do on its own — and those assumptions are worth stress-testing, both because they may be wrong and because they go stale fast as models improve [A3]. The plainer version it cites: find the simplest solution that works, and increase complexity only when needed [A3]. Modules and interfaces follow the same rule. For a single caller, don't build three layers of abstraction for an extension that might come; when a second and third caller actually arrive, the boundary surfaces on its own.

## Case

**Scattered everywhere vs. wrapped in one service.** Picture an e-commerce system that adds an AI support agent. The first cut ships fast: whoever needs the model writes the call right there. The order page assembles a prompt and calls vendor A; the refund flow assembles another and calls vendor A; product recommendations do the same. The retry logic is written three different ways, the timeouts differ, the error handling differs. Now product says "switch to a cheaper vendor B." You have to change three unrelated business modules one by one, retesting each business flow as you go, because the model call is fused into the order logic, the refund logic, everything. Worse: hand that swap to an agent and it has to edit across orders, refunds, and recommendations at once — the blast radius landing squarely on the order system you least want disturbed.

Once it's gathered behind a `generateAnswer()` service, the same swap changes shape entirely. The business code doesn't move; only that one module's internals go from vendor A to B, and the menu the business side sees — send a prompt, get an answer, handle errors — doesn't change by a character. The order system never learns the vendor changed, so it never gets pulled in. The value of a good boundary shows clearest on exactly this kind of task: it decides whether swapping a model means moving a non-load-bearing partition or breaking open the order system's load-bearing wall.

**When the contract is unclear, the agent trips on the boundary too.** A3 records a concrete instance. In its planner–generator–evaluator long-running harness, the generator agent wrote an endpoint to reorder animation frames and defined the `PUT /frames/reorder` route after the `/{frame_id}` routes; FastAPI then matched `reorder` as a `frame_id` integer and returned a 422: "unable to parse string as an integer" [A3]. That's a boundary that wasn't sorted out — two routes whose menus collided in URL shape, and the framework picked the wrong entry by definition order. The agent didn't catch this itself. A separate evaluator agent flagged it, and reported it specifically enough to act on without more digging [A3]. The lesson is concrete: in the agent era, "who checks that the boundary is right" has to be designed into the process — you can't count on the working agent to check its own.

**On long tasks, structure is the precondition for the agent finishing at all.** A3 carries one finding through the whole piece: getting an agent to finish a long, multi-step build rests on two structural things — decomposing the build into tractable chunks, and using structured artifacts to hand off context between sessions [A3]. In its harness the generator worked one feature at a time; before starting a chunk, the generator and evaluator first negotiated a "sprint contract" — agreeing, before any code was written, on what "done" meant and which testable behaviors would verify it [A3]. Put another way, even an agent doing the work needs a clear decomposition and an explicit definition of done to run steadily. Structure isn't decoration for human eyes. It's the foundation that determines whether the agent finishes the job.

## Anti-patterns

- **"It runs" as the acceptance bar.** One green run proves only that nothing collapsed this time, not that the boundary was drawn right. Especially dangerous in the agent era, because next time the agent follows the pipe you never sorted out and opens a wall it shouldn't — faster than you can stop it.
- **AI calls fused into business code.** Every spot that uses the model calls the vendor SDK directly, with its own parameters, retries, and error handling. Swapping models means editing across a pile of unrelated modules — steering the agent's blast radius straight onto the core system.
- **Abstraction built for extensibility that doesn't exist yet.** Three layers of interface and five config options for a single caller. This breaks "add complexity only when needed"; A3's line that every component encodes an assumption that may go stale [A3] applies just as well to the abstraction you built too early — it usually hardens into dead structure no one dares touch.
- **Tools for the agent that are too broad, too many, too overlapping.** One tool that does everything, or ten tools whose jobs overlap. A8 says it outright: when tools multiply and purposes blur, agents pick the wrong one and use it wrong [A8]. Narrow purpose isn't fussiness — it's helping the agent make fewer mistakes.
- **Constraints written into the prompt, not the contract.** Hoping a line like "mind the call order" or "don't touch the order module" holds the boundary. Real boundaries are enforced by types, schemas, and module splits; a constraint living in the prompt is one the agent can ignore at any moment.
- **Letting the working agent check its own boundaries.** A3's finding is that agents tend to praise their own work and test only superficially [A3]; the route-collision bug was caught by a separate evaluator, not by the agent that wrote it [A3]. Keep boundary acceptance external — don't fold it back into the author.

## Checklist

- Can I say what a module does without opening it, going only by its outward interface?
- Are model / AI calls gathered behind *one* interface, or scattered across several business modules? Would swapping a vendor stay sealed inside one module?
- For data contracts passed across modules and services, do field names, types, and units agree in all three places (ORM ↔ interface ↔ frontend)?
- Does my interface contract put all five things — **inputs, outputs, errors, permissions, performance** — somewhere code can check, or do they live only in someone's head?
- Are the tools the agent uses narrow and clear in purpose, stable in output, with error messages it can act on?
- If an agent edited this code, how many modules would one change reach across? Is the blast radius held in by a load-bearing wall (a clean boundary)?
- Does "done" have a testable criterion, not "it ran this time"? And is the boundary checked by a role separate from the author?

## Self-test

- Take the spot in your system where AI calls are most scattered. If you had to swap models tomorrow, how many files would you touch? If the answer is "spread across a dozen places," what you're missing isn't a stronger model — it's a load-bearing wall to gather them behind.
- The last time you had an agent make a change across several files, did one edit reach somewhere you didn't expect? Was that reach the model not being smart enough, or your module boundaries already tangled together?
- Hand someone new — or an agent — who knows nothing about your structure the interface description of one of your modules. Can they call it correctly without reading the implementation? Wherever they can't is exactly where your contract isn't clear.
