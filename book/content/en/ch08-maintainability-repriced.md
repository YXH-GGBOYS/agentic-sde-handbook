---
id: ch08
order: 8
part_zh: 第二卷 · 软件工程基础与 AI 时代重校
part_en: Part II · Software Engineering Foundations, Recalibrated
title_zh: 代码质量与可维护性的重定价
title_en: Code Quality & Maintainability, Repriced
sources: [A1, A8]
---

Every line you write has at least two readers: yourself three months from now, and that very capable contractor who knows nothing about how your place runs — the agent. Name a variable `u`, `t`, or `x`, and a human has to guess what it holds. So does the agent. The difference is that a human who guesses wrong gets stuck for an afternoon and comes back to ask you. The agent doesn't stop. It carries on editing based on its guess, and it edits the wrong thing with confidence.

Writing code is getting fast and cheap. Reading it, changing it, and confirming a change is right have not — and because the volume of code has gone up, they've gotten more expensive. This chapter is about that mismatch. When the output side loosens, understanding becomes the new bottleneck, which is why maintainability matters more now, not less.

## Everyday analogy

Say you've hired a new kitchen hand. Quick on his feet, knows nothing about your kitchen. You leave a note on the counter: "chop the u, add x when t hits 3." You know what it means — `u` is the onion, `t` is the timer at 3 minutes, `x` is that unlabeled jar of salt. He doesn't. He sees `t` at 3 and reads it as burner setting 3; he grabs the jar next to the salt and adds sugar.

He won't stop to ask. He's fast, he works from his own reading of the note, and by the time you turn around the dish is cloyingly sweet.

Now rewrite the note: "slice the onion, add a small spoon of salt after 3 minutes on the timer." Same instruction, but now there's nothing to guess — he just follows it. The extra words aren't for you. You already knew. They're for the person who doesn't know how your kitchen runs, so he makes one fewer mistake.

Naming and structure in code are that note. Readability isn't decoration for people who already understand; it's the interface for people who don't. That set of people used to be new teammates and your future self. Now it includes an agent that reads fast, edits fast, and guesses wrong just as readily.

## Definition

Three foundational ideas first, assuming you've met none of them. Everything later rests on these.

**Readability** is how clearly code says what it's trying to do, so the reader doesn't have to guess. The test is plain: another person — or you, six months out — opens the file, doesn't look elsewhere, doesn't ask the author, and can tell what this block does, why this branch exists, what this variable holds. If they can't, they guess, and a guess can be wrong. Poor readability isn't a "style issue." It shifts the cost of understanding from the one person who wrote the code onto everyone who later reads it, and code is read far more often than it's written.

Readability comes down to two things. Names: variables, functions, and classes should say what they are and what they're for. `isEligible` tells you one more thing than `flag` does — this boolean means "has eligibility," not just some switch. And structure: a function should do one thing you can state in a sentence, with branching and nesting shallow enough that the reader doesn't have to keep a stack in their head. A three-hundred-line function with five levels of nested `if` mixing network calls and money math isn't "powerful." It's something nobody dares touch.

**Refactoring versus rewriting** are two ways to improve code, and the difference is risk. Refactoring changes internal structure without changing external behavior — the inputs and outputs, the contract callers depend on, all stay put; only the implementation moves. Splitting one big function into several small ones, renaming a vague variable, collapsing three duplicated blocks into one — all refactoring. Its safety net is tests: green before, green after means behavior didn't change. Rewriting throws the thing out and starts over, behavior can shift with it, and the risk is much higher because you have to re-verify everything. Prefer refactoring day to day. Reach for a rewrite only when the structure is rotten enough that refactoring would cost more — a judgment that's easy to get wrong, because people overestimate themselves and underestimate the edge cases hiding in old code.

**Technical debt** is a loan you take against future maintenance cost to go faster today. Borrowing isn't the problem. Shipping a stopgap to hit a deadline, skipping a layer of abstraction, hardcoding a value — all reasonable loans. The problem is borrowing without recording it and never repaying. The danger isn't owing; it's forgetting you owe. Three months on, nobody remembers why this was written this way, what got bypassed, or under what condition it breaks. The fix is to leave a note when you borrow: why the stopgap, what the risk is, and when and under what condition it should be paid back. Turn implicit debt into explicit, written-down debt.

These three line up: readability sets how much effort it costs others (and the agent) to read your code; refactoring keeps lowering that effort without breaking behavior; technical debt is the slice of that cost you knowingly defer and promise to repay. Their shared currency is the cost of understanding.

## Why it matters

There used to be an implicit way of doing the math. Writing code was slow and expensive, so readability and refactoring — investments "for easier maintenance later" — sat behind "just ship the feature." If someone really had to change it down the line, they'd spend the time to read it then; the cost of reading was small next to the cost of writing.

Agents changed both sides of that ledger. Writing got much cheaper: an agent produces working code in minutes. Reading, changing, and signing off did not get cheaper — and with output up, the total amount of code to read and change went up too. When writing approaches free, the bottleneck moves wholesale to understanding. Maintainability gets repriced: it goes from an investment you redeem later to an expense you're paying continuously, now.

The sharper shift is this: readability is now an interface for the agent as much as for people. That isn't a figure of speech. Anthropic's guidance for Claude Code keeps coming back to one point — the more precise your instruction, the fewer corrections you need. A vague "fix the login bug" works far worse than one that names the symptom, the likely location, and what "fixed" looks like [A1]. The same logic holds for the code itself: clear names and explicit conventions are the agent's input when it reads your repo. A field called `user.isPremiumMember` tells the agent at a glance what it means and when to use it. A field called `u.t` leaves the agent to infer from context — and when it infers wrong, it won't stop, it'll edit on the wrong reading. A bad variable name isn't ugly to an agent; it's feeding it bad context directly.

The agent era also adds a note written specifically for the agent: `AGENTS.md` / `CLAUDE.md`. It's persistent context the agent reads at the start of every run, spelling out which commands this repo uses, which directories not to touch, what counts as done, and the non-obvious gotchas [A1]. Its discipline is identical to readable code: keep it short, keep it human-readable, and for each line ask whether removing it would cause the agent to make mistakes — if not, cut it, because a bloated note buries the rules that matter and the agent reads right past them [A1]. Readability, conventions, and the house-rules note are three layers of one thing: putting the rules you keep in your head somewhere the agent can read them.

The debt note gains value here too. That "why is this a stopgap" comment used to be for whoever came next; now it's context you can hand straight to the agent. Point an agent at code that carries debt, paste it the debt note, and it knows why this looks the way it does and which edge it mustn't touch — instead of mistaking the stopgap for the intended design and extending it. Without the note, the agent only sees what the code currently looks like, not that it wasn't supposed to look that way.

## In practice

**Make names say the intent.** Replace expressions a machine parses but a human has to decode with ones that read in one pass:

```python
# Before: every symbol is a guess
if u.t == 3 and x > 7:
    process(u)

# After: reads in one pass
if user.is_premium_member and order.total > FREE_SHIPPING_THRESHOLD:
    grant_free_shipping(order)
```

The version on the right isn't faster or shorter, but it no longer asks the reader — or the agent — to guess what `t == 3` means or where the magic `7` came from. This is A8's principle landing in code: agents handle meaningful natural-language names far better than cryptic identifiers like `uuid` or `256px_image_url`, and resolving vague identifiers to semantically clear names measurably cuts their mistakes [A8]. What holds for people holds for the agent.

**Split a big function into small ones whose names state their job.** A three-hundred-line function mixing validation, calculation, persistence, and notification becomes four: `validate_order`, `calculate_total`, `persist_order`, `notify_user`. Each name is its own job description; the reader doesn't have to read the whole body to learn what it does. This is pure refactoring — external behavior unchanged, tests still green — and it cuts the cost of understanding the code to a fraction. A8's advice for writing tools is to name and describe them the way you'd describe the tool to a new hire on your team [A8]; writing functions is the same standard: assume the reader knows nothing about this code, and let the name do the explaining.

**Write a debt note, not just a `# TODO`.** A useful debt note answers three questions: why the stopgap, what the risk is, and when or under what condition it gets repaid.

```python
# TECH DEBT (2026-06-13, dsh):
# Hardcoded exchange rate 7.2 because the rate service ships after this release.
# Risk: amounts are wrong while the rate moves — display only, not persisted.
# Repay: once the rate service is live, call get_rate() and delete this constant.
```

A bare `# TODO: fix rate` tells nobody three months later what it refers to, whether it's safe to touch, or what breaks if you do. The full note serves the next person and doubles as the context you paste to an agent when you later send it to repay the debt.

**Make tool output short, structured, and carrying paths and line numbers.** This serves people and the agent both. A good error or check should tell you which file, which line, and what's wrong — not dump a wall of traceback for you to fish through. A8 is concrete about this: tools should return only high-signal information and not waste the agent's limited context on the irrelevant; Claude Code caps a single tool response at 25,000 tokens by default and relies on pagination, filtering, and truncation to keep it small [A8]. Rather than a `read_logs` that returns everything, build a `search_logs` that returns only the relevant lines plus surrounding context [A8]. Hold your own lint scripts, test reports, and CI output to the same standard — short, with paths and line numbers, structured. People read it faster, and the agent reads it more accurately.

## Case

**A hard-to-read block, before and after.** Here's something you'll recognize from real code — it runs, and nobody dares touch it:

```python
def chk(d, u):
    r = []
    for i in d:
        if i[2] == 1 and (u[3] == 'p' or i[4] > 100):
            if i[5] not in [x[0] for x in r]:
                r.append((i[5], i[1]))
    return r
```

What's `d`? What does `u[3] == 'p'` mean? What's that `100` in `i[4] > 100`? All guesswork. A human spends ten minutes decoding it; an agent handed this either guesses the semantics wrong and breaks it, or rewrites the whole thing — and rewriting code you don't understand is high-risk, because you have no idea which edge cases the original was handling. After refactoring:

```python
def find_eligible_items(items, user):
    """Pick items eligible for free shipping for this user, deduped by SKU."""
    eligible = []
    seen_skus = set()
    for item in items:
        is_in_stock = item.status == IN_STOCK
        qualifies = user.is_premium_member or item.price > FREE_SHIPPING_THRESHOLD
        if is_in_stock and qualifies and item.sku not in seen_skus:
            seen_skus.add(item.sku)
            eligible.append((item.sku, item.name))
    return eligible
```

Behavior is unchanged, tests stay green. But now names like `is_in_stock` and `qualifies` state the conditions for you, and `seen_skus` as a `set` replaces the old `x[0] for x in r` O(n²) dedup — surfacing a performance problem along the way. More to the point: when the agent comes to touch this, it can read it and edit it precisely without breaking the semantics, instead of guessing at a wall of symbols.

**Why agent-written code especially needs a maintainability review.** Agents have one very concrete trait: they produce code that runs but is hard to read, fast. They don't get tired, they don't get annoyed at a function growing too long, so they readily write three-hundred-line functions, deeply nested branches, and special-cases piled up to pass a test — code that runs right now and passes acceptance, if acceptance only checks whether tests are green. Anthropic named this the trust-then-verify gap: the agent produces a plausible-looking implementation that doesn't actually handle the edge cases [A1]. Poorly readable code widens that gap, because hard-to-read code makes the hidden problems harder to catch during review.

That gives a concrete review bar: reviewing an agent's output can't stop at "did it pass." It has to ask "can I — or the next agent — change this in three months." Do the names state the intent, is each function's job single, are there special-cases bolted on just to pass a test — these aren't style fussiness; they govern whether the next person (or agent) who edits this code steps on a landmine. A1's remedy is direct: always give the agent a check it can run itself — tests, scripts, screenshots — and don't ship what you can't verify [A1]. And being able to verify it presupposes the code is readable and inspectable in the first place.

## Anti-patterns

- **Rescuing readability with comments.** A long comment explaining what a badly named function does. Comments go stale and drift from the code; a good name doesn't. If a name can say it, don't push it into a comment.
- **Borrowing without recording.** Ship the stopgap, leave no note. Three months later that block is a black box everyone routes around — not because it's complex, but because nobody knows what it bypassed or whether touching it breaks something.
- **Mixing refactoring into a behavior change.** One PR both changes behavior and rearranges structure, so the reviewer can't tell which diffs are "behavior changed" from which are "just moved." Refactoring belongs in its own PR, so "tests still green" can actually prove "behavior unchanged."
- **Verifying only that agent code runs, not that it's maintainable.** Tests green, merged, no look at whether it can be changed in three months. Code that runs but is hard to read is exactly what agents are best at mass-producing — gating only on green removes the maintainability check entirely.
- **A house-rules note that keeps growing.** Pile every rule you can think of into `CLAUDE.md` and the ones that matter get buried, so the agent reads past them. A1's test: for every line, ask whether removing it would cause the agent to make mistakes — if you can't say yes, cut it [A1].

## Checklist

- Can another person, without looking elsewhere or asking me, read this block once and tell what it does and why each branch exists?
- Do the key variable and function names say what they are and what they're for, or do they make the reader decode (`u.t`, `flag`, `x`)?
- Was what I just did a refactor or a rewrite? If a refactor, were tests green before and after? Is it its own PR, with no behavior change mixed in?
- Does every piece of debt I took on have a note stating why, the risk, and when it's repaid — or just a bare `# TODO`?
- Does the repo I point the agent at have a short, human-readable `AGENTS.md` spelling out commands, off-limits areas, and the done bar?
- When I review agent output, do I check "can this be changed in three months," not just "are the tests green"?
- Is the output of the tools/scripts I write short, carrying paths and line numbers, and structured — or a wall for people and the agent to fish through?

## Self-test

- Open a block of your own code you haven't touched in three months. Without checking git or asking anyone, can you say in one minute what it does and why each branch exists? If not, the problem is in the original naming and structure, not your memory.
- Hand the `chk(d, u)` above to someone (or an agent) who doesn't know what it does. How long before they dare change it? That delay is your real measure of maintainability — not whether the code is pretty, but whether the next person to edit it will break it.
- The last time you had an agent change code that carried debt, did you hand it the "why this is a stopgap" note along with the code? If not, did it extend the stopgap as if it were the intended design, or just luck out and not — and how would you know?
