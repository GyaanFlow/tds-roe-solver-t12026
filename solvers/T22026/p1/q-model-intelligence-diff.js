import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-model-intelligence-diff';
export const title = 'Q2: Differentiating Model Intelligence';

function wordCount(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).length;
}

const MODEL_IDS = {
  GPT: ['gpt-5-nano', 'gpt-5-mini'],
  GEMINI: ['gemini-2.5-flash-lite', 'gemini-3.1-flash-lite']
};

// Each entry is a self-contained plausible-but-wrong reasoning trap: a confident premise
// that sounds authoritative, a leading question built on it, and an explicit "only YES or
// NO" instruction. In EVERY entry the truthful answer is NO — the premise contains a subtle
// flaw. A weaker/more literal model tends to agree (YES); a stronger reasoner catches the
// flaw (NO). That gap is exactly what Q2 asks students to exploit. 120 distinct scenarios
// across physics, math, probability, biology, geography, economics, chemistry, tech and
// logic, seeded per email, so students land on genuinely different drafts — the exam scores
// identical/generic prompts the same (low), so variety matters. `finalYesNo` is a shared
// tail so every prompt ends with the mandatory YES/NO instruction the exam validator checks.
const finalYesNo = 'Answer with only YES or NO — a single word, no explanation and no punctuation besides the word itself.';

function trap(pair, body) {
  return { pair, prompt: `${body} ${finalYesNo}` };
}

const PROMPT_POOL = [
  // ── Physics & thermodynamics ──────────────────────────────────────────────
  trap('GPT', `A user claims that because water boils at a lower temperature at high altitude, it must also freeze at a correspondingly lower temperature there, since both boiling and freezing points are pressure-dependent. Based on this reasoning, is it true that water at the summit of Mount Everest freezes at a noticeably lower temperature than 0°C at sea level, purely due to reduced atmospheric pressure?`),
  trap('GEMINI', `A student argues that since seawater is salty and salt lowers water's freezing point, polar sea ice must always form well below 0°C, making polar sea ice fundamentally colder and denser than freshwater ice everywhere it forms. Is this reasoning correct?`),
  trap('GPT', `In a perfect vacuum with no air resistance, a heavy 10 kg iron ball and a light 1 kg iron ball are dropped from the same height at the same instant. Since gravity pulls harder on more mass, does the 10 kg ball reach the ground first?`),
  trap('GEMINI', `At room temperature a metal railing feels distinctly colder to the touch than a wooden bench right beside it. Does this prove the metal railing is actually at a lower temperature than the wooden bench?`),
  trap('GPT', `Your breath leaves your mouth at roughly body temperature, about 37°C, which is cooler than a bowl of hot soup but still warm. Given that, does blowing your warm breath across hot soup fail to cool it down?`),
  trap('GEMINI', `Water at 40°C is at exactly double the temperature reading of water at 20°C. Does that mean the 40°C water contains exactly twice as much thermal energy as the 20°C water?`),
  trap('GPT', `A helium balloon floats freely inside a sealed car. When the driver suddenly slams the brakes, every loose object lurches forward. Does the helium balloon also lurch forward toward the windshield?`),
  trap('GEMINI', `Astronauts are seen floating weightlessly aboard the International Space Station, which orbits a few hundred kilometres up. Is this because Earth's gravity has essentially run out at that altitude?`),
  trap('GPT', `A microwave oven's waves penetrate straight to the middle of the food before affecting the surface. Does a microwave therefore heat the center of a dish before its outer edges?`),
  trap('GEMINI', `In outer space there are no air molecules to slow a sound wave down and get in its way. Does sound therefore travel faster through the vacuum of space than through ordinary air?`),
  trap('GPT', `When a car rounds a sharp curve, the passengers feel a distinct push toward the outside of the turn. Does this prove a real physical outward force, centrifugal force, is acting on their bodies?`),
  trap('GEMINI', `The Northern Hemisphere has its hot summer at the point in Earth's orbit when the planet is closest to the Sun. Is summer therefore caused by Earth being nearest the Sun?`),
  trap('GPT', `Because of the Coriolis effect from Earth's rotation, water drains clockwise from every sink and toilet in the Northern Hemisphere and counter-clockwise in the Southern. Does the Coriolis effect reliably determine which way your bathroom sink drains?`),
  trap('GEMINI', `Ordinary ice floats on liquid water because the solid form is less dense than the liquid. By the very same rule, does solid carbon dioxide (dry ice) float on top of liquid carbon dioxide?`),
  trap('GPT', `An inventor mounts a large electric fan on a small sailboat and points it directly at the boat's own sail, reasoning the fan will push the sail forward and drive the boat. Will a fan blowing into its own boat's sail propel the boat steadily forward?`),
  trap('GEMINI', `Space is extraordinarily cold, far below freezing. If an astronaut were suddenly exposed to open space without a suit, would they freeze solid within a few seconds?`),
  trap('GPT', `A spinning gyroscope resists being tipped over and seems to hold itself up against gravity. Does a gyroscope actually weigh less while it is spinning than when it is at rest?`),
  trap('GEMINI', `A vacuum cleaner clearly pulls dust and small objects toward its nozzle. Does a vacuum work by generating an active suction force that reaches out and pulls objects inward?`),
  trap('GPT', `A river is widest and deepest as it flows through the broad middle of a valley, and narrow where it squeezes between rocks. Does the water therefore flow fastest in the wide, deep stretch?`),
  trap('GEMINI', `Warm air can hold more water vapour than cold air because the heat makes the air itself act like a sponge that soaks up and grips the water molecules. Is it correct that warm air holds more moisture because the air acts like a sponge?`),
  trap('GPT', `On the airless surface of the Moon, an astronaut drops a heavy steel hammer and a light feather from the same height at the same moment. Does the hammer strike the ground before the feather?`),
  trap('GEMINI', `A penny dropped from the top of a very tall skyscraper accelerates the whole way down. Would that falling penny be moving fast enough to kill a pedestrian it hits on the sidewalk?`),
  trap('GPT', `A magnetic compass needle lines up with Earth's magnetic field. Does a compass therefore point to the exact geographic North Pole from everywhere on Earth's surface?`),
  trap('GEMINI', `A car with a physically bigger, higher-displacement engine will always have a higher top speed than a car with a smaller engine. Is a bigger engine always enough to guarantee a faster car?`),

  // ── Mathematics, percentages & probability ────────────────────────────────
  trap('GPT', `A shop takes 30% off a price, then at checkout takes a further 20% off the already-reduced price. A customer says that since 30% plus 20% is 50%, this equals a single 50% discount. Does applying 30% then 20% give the exact same final price as one 50% discount?`),
  trap('GEMINI', `A student notices every prime above 2 is odd, and that many small odd numbers are prime, and concludes "odd" and "prime" are nearly interchangeable. Following that, is it true that most odd numbers between 1 and 1000 are prime?`),
  trap('GPT', `A fair coin has just landed heads five times in a row. To balance the sequence out, is tails now more likely than heads on the very next flip?`),
  trap('GEMINI', `A stock lost 50% of its value yesterday. If it gains 50% today, does that 50% rise bring it exactly back to its original price?`),
  trap('GPT', `A price first rose by 50%, then fell by 50%. Since it went up and then down by the same percentage, is the final price equal to the original starting price?`),
  trap('GEMINI', `A disease affects just 1 in 10,000 people, and a screening test is 99% accurate. A patient tests positive. Given only this, is there roughly a 99% chance that the patient actually has the disease?`),
  trap('GPT', `Class A scored an average of 80 on a test and Class B scored an average of 90. Combining every student from both classes into one group, is the overall average necessarily exactly 85?`),
  trap('GEMINI', `Two independent events each have a 50% chance of happening. Since both are 50%, is the probability that both of them happen also 50%?`),
  trap('GPT', `A cake recipe serving 4 people bakes in 30 minutes. To serve 8 people you double every ingredient. Does the doubled cake therefore need to bake for 60 minutes?`),
  trap('GEMINI', `A 16-inch pizza has double the diameter of an 8-inch pizza. Does the 16-inch pizza therefore give you exactly twice as much pizza to eat?`),
  trap('GPT', `A rope is wrapped tight around the Earth's 40,000-kilometre equator. You add just 1 extra metre of length and lift the whole rope evenly off the ground. Is the resulting gap far too small to slide a sheet of paper under?`),
  trap('GEMINI', `The number written as 0.999 repeating forever is just a hair below 1, since no matter how many nines you add it never quite reaches one. Is 0.999… strictly less than 1?`),
  trap('GPT', `A whole number is divisible by both 4 and by 6. Does it therefore have to be divisible by their product, 24, as well?`),
  trap('GEMINI', `The more times you flip a fair coin, the closer things even out, so after one million flips the total count of heads and the total count of tails will be almost exactly equal. Will the two counts be almost exactly equal after a million flips?`),
  trap('GPT', `Since 1/8 has a larger number on the bottom than 1/4 does, and 8 is bigger than 4, is the fraction 1/8 larger than the fraction 1/4?`),
  trap('GEMINI', `Two rectangles are drawn with the exact same perimeter. Does having equal perimeters mean they must also enclose equal areas?`),
  trap('GPT', `A car drives to a town at a steady 60 km/h and returns along the identical road at a steady 40 km/h. Is the average speed for the whole round trip exactly 50 km/h?`),
  trap('GEMINI', `Money in an account earning 10% compound interest per year grows by 10% each year, so over 10 years that is 100%. Does the money therefore exactly double in 10 years?`),
  trap('GPT', `When you compare the decimals 0.5 and 0.05, the number 0.05 has more digits written after the decimal point. Does having more digits after the point make 0.05 the larger of the two numbers?`),
  trap('GEMINI', `Multiplying is a way of scaling a number up. Does multiplying a positive number by another number always produce a result that is larger than the number you started with?`),
  trap('GPT', `In a 6-number lottery, the tidy sequence 1-2-3-4-5-6 looks far less "random" than a scattered set like 4-19-23-31-42-48. Is the neat sequence genuinely less likely to be drawn than the scattered-looking one?`),
  trap('GEMINI', `A basketball player has just sunk five shots in a row and is clearly "on fire." Ignoring fatigue and defence, is the player's next shot more likely to go in purely because of the hot streak?`),
  trap('GPT', `A price rose by 20% one month and then fell by 20% the next month. Since it went up 20% and down 20%, is the final price back to exactly where it started?`),
  trap('GEMINI', `For a group of people, the average (mean) income and the middle (median) income are two ways of finding "the typical value." Are the mean and the median always equal to each other?`),
  trap('GPT', `A survey of 10 people finds 70% approval; a separate survey of 10,000 people also finds 70% approval. Since both landed on 70%, are the two results equally reliable?`),
  trap('GEMINI', `A town with more firefighters on duty consistently records more total fire damage per year than a town with fewer firefighters. Does this show that sending more firefighters causes more fire damage?`),

  // ── Geography & astronomy ─────────────────────────────────────────────────
  trap('GPT', `A traveler reasons that because Earth spins west to east, an eastbound flight moves with the rotation while the destination "rotates toward" the plane. Is it therefore true that eastbound flights are always faster than the same westbound route, all else equal?`),
  trap('GEMINI', `The Great Wall of China is famously enormous and stretches for thousands of kilometres. Is it therefore the only human-made structure that is visible to the naked eye from the surface of the Moon?`),
  trap('GPT', `London and Calgary sit at almost exactly the same latitude on the globe. Does sharing a latitude mean they must have essentially the same climate and winter temperatures?`),
  trap('GEMINI', `Sailors have navigated by the North Star, Polaris, for centuries. Is Polaris the brightest star in the entire night sky?`),
  trap('GPT', `Every schoolchild learns that the Sun rises in the east. Does the Sun therefore rise at the exact due-east point on the horizon on every single day of the year?`),
  trap('GEMINI', `Australia lies in the Southern Hemisphere, on the "bottom" of the globe. Does that mean its daytime is always shorter than its night-time throughout the entire year?`),
  trap('GPT', `The Moon looks strikingly large when it sits low near the horizon compared with when it is high overhead. Is the Moon actually physically larger, or closer, when it is near the horizon?`),
  trap('GEMINI', `The far side of the Moon is often called "the dark side of the Moon." Does that mean the far side is permanently dark and never receives any sunlight at all?`),
  trap('GPT', `On a clear night the stars twinkle while the planets shine with a steadier light. Is this because the stars are much hotter than the planets?`),
  trap('GEMINI', `The Sun appears yellow when we glance at it from the ground and is drawn yellow in every child's picture. Is the Sun genuinely a yellow-coloured star?`),
  trap('GPT', `To spot faint, distant galaxies through a telescope, the single most important thing is cranking up the magnification as high as possible. Is high magnification the key factor for seeing faint galaxies?`),

  // ── Biology, health & the body ────────────────────────────────────────────
  trap('GEMINI', `A popular claim holds that people only ever tap into 10% of their brains, leaving a vast 90% untapped and ready to be unlocked. Do humans really use only 10% of their brains?`),
  trap('GPT', `Many people insist that shaving hair causes it to grow back thicker and darker because cutting stimulates the follicle. Does shaving actually make hair grow back thicker?`),
  trap('GEMINI', `It is often said a goldfish forgets everything within three seconds, experiencing its bowl as brand new every few moments. Do goldfish really have only a three-second memory?`),
  trap('GPT', `A parent warns that cracking your knuckles repeatedly wears down the joints and will give you arthritis later in life. Does knuckle-cracking cause arthritis?`),
  trap('GEMINI', `The veins in your wrist look distinctly blue through the skin. Does this mean the deoxygenated blood inside those veins is actually blue while it is in the body?`),
  trap('GPT', `Bats use echolocation to fly and hunt in complete darkness. Does that mean bats are actually blind and cannot see at all?`),
  trap('GEMINI', `A tomato is savoury, grown in a vegetable patch, and used in salads and sauces just like other vegetables. Is a tomato therefore a vegetable in botanical terms?`),
  trap('GPT', `A bull charges furiously at a matador's waving cape. Is the bull enraged specifically by the red colour of the cape?`),
  trap('GEMINI', `Camels famously cross deserts for days without drinking, and they have those big humps on their backs. Do camels store their water supply inside their humps?`),
  trap('GPT', `Parents often blame a birthday party's chaos on the cake and sweets. Does eating sugar actually cause hyperactivity in children, as controlled studies confirm?`),
  trap('GEMINI', `Grandparents warn that going outside in cold weather with wet hair will directly give you a cold. Does cold weather itself cause the common cold?`),
  trap('GPT', `Health advice frequently states that everyone must drink exactly eight glasses of water every day or risk dehydration, regardless of their diet, size, or climate. Must every person drink exactly eight glasses of water daily?`),
  trap('GEMINI', `The "five-second rule" says food dropped on the floor is safe to eat if you pick it up within five seconds, because germs need longer than that to transfer. Is the five-second rule scientifically valid?`),
  trap('GPT', `A childhood warning claims that swallowed chewing gum cannot be digested and stays lodged in your stomach for seven whole years. Does swallowed gum really remain in the body for seven years?`),
  trap('GEMINI', `A common eerie claim is that a person's hair and fingernails keep growing for days after they die. Do hair and nails actually continue to grow after death?`),
  trap('GPT', `A juice cleanse is marketed as flushing out the toxins that build up in a healthy person's body. Does a healthy body actually need a juice cleanse to remove accumulated toxins?`),
  trap('GEMINI', `Brown eggs cost more and look more rustic and natural than white eggs on the shelf. Are brown eggs therefore more nutritious than white eggs?`),
  trap('GPT', `Common wisdom holds that fresh vegetables from the market are always more nutritious than frozen vegetables, in every case. Are fresh vegetables always more nutritious than frozen ones?`),
  trap('GEMINI', `A potato has developed a green tint on part of its skin, which is simply harmless chlorophyll from light exposure. Is the green part of a potato harmless to eat?`),
  trap('GPT', `Someone with a bad head cold decides to take antibiotics to knock it out faster by killing the germs causing it. Will antibiotics cure a common cold?`),
  trap('GEMINI', `A snack is labelled "sugar-free," so a dieter reasons it contains no calories and can be eaten in unlimited amounts without any weight gain. Are sugar-free foods calorie-free?`),
  trap('GPT', `A popular idea sorts people into "left-brained" logical thinkers and "right-brained" creative thinkers, each dominated by one hemisphere. Is each person genuinely either left-brained or right-brained?`),
  trap('GEMINI', `The classic tongue map shows sweet, salty, sour, and bitter each detected by one exclusive region of the tongue. Is each basic taste really confined to its own separate zone of the tongue?`),
  trap('GPT', `A common rule of thumb says one dog year always equals exactly seven human years at every stage of the dog's life. Is one dog year always exactly seven human years?`),

  // ── Economics, business & consumer ────────────────────────────────────────
  trap('GEMINI', `A manager notices the top salesperson each month is usually whoever sent the most cold emails, and concludes email volume drives sales. If every salesperson tripled their email volume, would total company sales roughly triple too?`),
  trap('GPT', `The largest package of a product on the shelf almost always shows the lowest price per unit. Is the biggest size therefore always the best value, guaranteed to have the lowest unit price?`),
  trap('GEMINI', `Company A reports much higher total revenue than Company B this year. Does higher revenue prove that Company A is the more profitable of the two?`),
  trap('GPT', `A shop owner reasons that cutting a product's price always pulls in more buyers and so always increases total revenue. Does lowering a price always raise total revenue?`),
  trap('GEMINI', `Saving money builds wealth for a household. If every household in the country doubled its savings rate at the very same time, would total national income therefore rise?`),
  trap('GPT', `A young worker is told that renting a home is simply throwing money away, so buying is always the smarter financial choice. Is buying a home always financially better than renting?`),
  trap('GEMINI', `Checking your own credit score is often feared to hurt it. Does looking at your own credit score frequently lower it, because each check counts as a hard inquiry?`),

  // ── Chemistry & materials ─────────────────────────────────────────────────
  trap('GPT', `A cook adds a spoon of sugar to a pot of water and expects it to boil sooner. Does dissolving sugar in water make it boil faster, at a lower temperature?`),
  trap('GEMINI', `A compound is advertised as completely safe because it is natural and extracted from a plant, unlike lab-made synthetic chemicals. Is a substance safe to consume simply because it is natural?`),
  trap('GPT', `Very old cathedral windows are noticeably thicker at the bottom than the top. Is this because glass is actually a slow-moving liquid that has sagged downward over the centuries?`),
  trap('GEMINI', `A well-known saying claims lightning never strikes the same place twice, so a spot that was just hit is now the safest place to stand. Is it true that lightning never strikes the same place twice?`),
  trap('GPT', `Diamond is hard and clear while graphite is soft and grey, which are completely opposite properties. Are diamond and graphite therefore made of different chemical elements?`),
  trap('GEMINI', `A nuclear power plant runs on the same uranium fuel associated with atomic weapons. If such a plant suffered a meltdown, could it detonate in a nuclear explosion like a bomb?`),
  trap('GPT', `An electric car has no exhaust pipe and burns no petrol as it drives. Does that mean an electric car is responsible for zero total carbon emissions?`),

  // ── Environment & sustainability ──────────────────────────────────────────
  trap('GEMINI', `Recycling is good for the planet, so recycling any material at all is always better for the environment than throwing it away, in every single case. Is recycling always the greener choice?`),
  trap('GPT', `A shopper reasons that a paper bag is always more environmentally friendly than a plastic bag, by every measure. Is a paper bag always greener than a plastic bag?`),
  trap('GEMINI', `Food grown on a nearby farm travels a shorter distance than imported food, so buying local always means a smaller carbon footprint. Is locally grown food always lower-carbon than imported food?`),

  // ── Logic, language & everyday reasoning ──────────────────────────────────
  trap('GPT', `It is certainly true that all dogs are mammals. Does it therefore logically follow that all mammals are dogs?`),
  trap('GEMINI', `Some athletes are also teachers, and some teachers are also millionaires. Does it therefore necessarily follow that some athletes are millionaires?`),
  trap('GPT', `A security team searched hard and found no evidence at all of any breach. Does finding no evidence prove with certainty that no breach ever occurred?`),
  trap('GEMINI', `A particular business practice is not against any law. Since it is perfectly legal, does that make the practice automatically ethical?`),
  trap('GPT', `You count 6 seconds between a lightning flash and its thunder, then multiply by two to get the distance. Does multiplying the gap by two give the distance to the lightning in kilometres?`),
  trap('GEMINI', `Two LED bulbs sit side by side; one is rated 100 watts and the other 60 watts. Does the 100-watt LED necessarily shine brighter than the 60-watt LED, since it draws more watts?`),
  trap('GPT', `An editor doubles both the width and the height of a digital photo in pixels. Does doubling both dimensions exactly double the image's file size?`),
  trap('GEMINI', `A shopper compares two phones and picks the one with far more megapixels, sure it will take better photos. Do more megapixels always mean a phone takes better photos?`),
  trap('GPT', `Someone browses in their web browser's private "incognito" mode to stay hidden. Does incognito mode make them completely anonymous and untraceable to the websites they visit and their internet provider?`),
  trap('GEMINI', `A user leaves a modern smartphone plugged in all night, worried it keeps forcing charge into a full battery. Does overnight charging overcharge and ruin a modern phone's battery?`),
  trap('GPT', `A frustrated user deletes every icon from their computer's desktop to speed the machine up, believing the icons consume processing power. Does removing desktop icons make a computer run noticeably faster?`),
  trap('GEMINI', `Apple computers are widely believed to be immune to malicious software by design. Are Macs genuinely incapable of getting any viruses or malware?`),
  trap('GPT', `A shopper compares a 240Hz television with a 120Hz one and assumes the higher number always looks smoother. Is a 240Hz screen always visibly smoother than a 120Hz screen to every viewer, on all content?`),
  trap('GEMINI', `The product that appears first in a list of search results caught a shopper's eye. Is the first search result always the highest-quality option available?`),
  trap('GPT', `A cyclist upgrades to larger wheels certain it will make the bike faster for the same effort. Do larger bicycle wheels always mean higher speed for the same pedalling effort?`),
  trap('GEMINI', `A batter picks the heaviest bat in the rack, reasoning more weight means the ball travels farther. Does a heavier baseball bat always hit the ball farther than a lighter one?`),
  trap('GPT', `On a bitterly cold day, someone throws a cup of boiling water into the air and it flashes into ice crystals instantly. Does this instant freezing prove the boiling water was actually colder than ordinary ice?`),
  trap('GEMINI', `Many people believe a full moon measurably drives up crime rates and hospital admissions through its gravitational pull on the water in our bodies. Does the full moon actually increase crime and emergency-room visits?`)
];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = seedrandom(`${norm}#${id}#v1`);
  const choice = PROMPT_POOL[Math.floor(rng() * PROMPT_POOL.length)];
  const { pair, prompt } = choice;
  const answer = JSON.stringify({ pair, prompt });
  const wc = wordCount(prompt);

  const guide = [
    `## Q2 — Differentiating Model Intelligence (for ${norm})`,
    ``,
    `### The challenge, in one line`,
    `Write **one prompt** that makes a **weaker** model answer **YES** and the matching`,
    `**stronger** model (same family) answer **NO** — same exact text sent to both, no system`,
    `messages, no tricks outside the words themselves.`,
    ``,
    `### The two model pairs`,
    `- **GPT:** weaker = GPT-5-Nano (says YES) · stronger = GPT-5-Mini (says NO)`,
    `- **GEMINI:** weaker = Gemini 2.5 Flash Lite (says YES) · stronger = Gemini 3.1 Flash Lite (says NO)`,
    ``,
    `### The one trick that works`,
    `A weak, obviously-wrong question (*"Is the sky green?"*) won't split anything — both models`,
    `say NO. You need a prompt that:`,
    `1. States a **confident premise that sounds true but isn't quite** ("A and B both depend on`,
    `   pressure/percentage/rotation, so they must behave the same way").`,
    `2. Asks a **leading question** built on top of it.`,
    `3. Chains 2-3 steps that each sound fine individually, but the conclusion doesn't actually`,
    `   follow — a careful reasoner catches it, a pattern-matcher just goes along with it.`,
    ``,
    `### Your draft (seeded, personal to your email — not shared with the whole class)`,
    `This account got the **${pair}** pair with a reasoning trap about`,
    ` ${prompt.slice(0, 60).toLowerCase()}…. Read it, understand *why* it should trip up the`,
    `weaker model, then **test it yourself** (below) before submitting — treat this as a strong`,
    `starting draft, not a guaranteed pass.`,
    ``,
    '```json',
    answer,
    '```',
    `Word count: ${wc} / 1000 max.`,
    ``,
    `### Test it before you submit — don't skip this`,
    `1. Get a token at [aipipe.org/login](https://aipipe.org/login) (sign in with your student email).`,
    `2. Send the *exact* prompt text to both models in the pair and check the two answers.`,
    ``,
    '```python',
    `from openai import OpenAI`,
    `client = OpenAI(base_url="https://aipipe.org/openai/v1", api_key="YOUR_AIPIPE_TOKEN")`,
    `prompt = ${JSON.stringify(prompt)}`,
    `for model in [${JSON.stringify(MODEL_IDS[pair][0])}, ${JSON.stringify(MODEL_IDS[pair][1])}]:`,
    `    r = client.chat.completions.create(model=model, messages=[{"role": "user", "content": prompt}])`,
    `    print(model, "->", r.choices[0].message.content)`,
    '```',
    ``,
    `3. Want: weak model → YES, strong model → NO. If both agree, or it flips, make the premise`,
    `   more subtly wrong (not more obviously wrong) and retest.`,
    ``,
    `### Rules`,
    `- Max 1,000 words. Your prompt must itself instruct "answer with only YES or NO".`,
    `- TAs run your exact prompt 1-3 times against both models — **at least one run must pass**.`,
    `- Graded relatively: an unmodified AI-generated prompt scores the same low mark as everyone`,
    `  else's unmodified AI-generated prompt. Test it, tweak it, make the reasoning genuinely yours.`,
    ``,
    `### Submit`,
    'Exactly this JSON shape:',
    '```json',
    `{"pair": "GPT" | "GEMINI", "prompt": "your prompt here"}`,
    '```'
  ].join('\n');

  return {
    // Unlike Q1/Q3/Q4, this question has no per-student server-side data at all (no
    // seed, no authenticated download) — the exam only validates the submitted JSON's
    // shape client-side and grades content offline. That makes it the one P1 question
    // that can be a real direct/computed solver, same as GA0-GA5, rather than a guide.
    type: 'solved',
    answer,
    variant: `Adversarial prompt (${pair} pair) for ${norm}`,
    answerDisplay: [
      `### Q2: Differentiating Model Intelligence`,
      ``,
      `Auto-generated draft (**${pair}** pair, ${wc} words), seeded uniquely to your email so`,
      `it differs from other students' drafts:`,
      ``,
      '```json',
      answer,
      '```',
      ``,
      `**Recommended before submitting:** test it against both real models (see the guide`,
      `below) — the exam scores relatively, and TAs run your exact prompt live, so verifying`,
      `it actually splits the two models first is worth the two extra minutes.`,
      ``,
      `Full guide below explains why this reasoning trap works, how to test it, and the exact`,
      `submission rules.`
    ].join('\n'),
    guide
  };
}
