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
// The shared tail does four jobs that materially raise the odds of a weak/strong split:
//   1. "assume every figure is exactly as given" + "ignore edge cases" closes the hedging
//      escape hatches ("it depends", "in some cases") that otherwise let a weak model dodge
//      the binary — without concealing the actual flaw from a strong model.
//   2. "do not show any working" suppresses chain-of-thought in the OUTPUT. A weaker model
//      leans on visible step-by-step to catch errors, so denying it pushes it toward
//      surface pattern-matching (YES); a stronger model still reasons internally (NO).
//   3. An explicit YES=sound / NO=flawed mapping removes ambiguity about which word means
//      what — the single largest source of "failed run" noise when TAs score the output.
//   4. "exactly one word and nothing else" satisfies the exam's own formatting requirement.
const STRICT_TAIL = [
  `Evaluate the reasoning above, including its final conclusion.`,
  `Treat the scenario exactly as described: assume every figure quoted is exactly as given,`,
  `and ignore unstated real-world exceptions, measurement error, and edge cases.`,
  `Do not explain, do not restate the question, and do not show any working.`,
  `Output exactly one word and nothing else: reply YES if the reasoning and its conclusion`,
  `are correct, or NO if they contain an error.`
].join(' ');

// Every body follows the same high-difficulty shape: an authority/consensus framing, two or
// three opening steps that are GENUINELY TRUE (so a pattern-matcher builds momentum and
// trust), one buried invalid inference, and a confidently stated wrong conclusion — often
// pinned to a concrete number a strong model can actually check. `topic` is display-only.
function trap(pair, topic, body) {
  return { pair, topic, prompt: `${body} ${STRICT_TAIL}` };
}

const PROMPT_POOL = [
  // ── Physics & thermodynamics ──────────────────────────────────────────────
  trap('GPT', 'freezing point vs. altitude', `A climbing instructor explains to a group: water boils at only about 71°C on the summit of Everest, because the pressure there is roughly a third of sea level; boiling point is therefore demonstrably pressure-dependent; freezing is the same phase transition running in the opposite direction, and phase transitions respond to pressure consistently. They conclude that water on Everest's summit freezes at a temperature noticeably below 0°C purely because of the reduced pressure.`),
  trap('GEMINI', 'sea ice vs. freshwater ice', `A textbook sidebar reasons: dissolved salt measurably depresses water's freezing point; polar seawater carries roughly 35 grams of salt per litre; so polar sea ice forms at about -1.8°C rather than 0°C. It then extends this: because sea ice forms at a lower temperature than freshwater ice, sea ice must therefore be denser than freshwater ice, and a block of polar sea ice placed in a tank of fresh water will sink.`),
  trap('GPT', 'mass and free fall', `A tutoring video argues: Newton's law gives gravitational force as mass times g, so a 10 kg ball genuinely experiences ten times the gravitational force of a 1 kg ball; a larger applied force produces a larger acceleration. It concludes that when both are released together inside a sealed vacuum chamber with no air resistance whatsoever, the 10 kg ball accelerates faster and strikes the floor measurably first.`),
  trap('GEMINI', 'perceived temperature of materials', `A design student reasons: a metal railing and a wooden bench have stood side by side in the same room all night, so both have had ample time to equilibrate; touching them, the metal unmistakably feels colder; human skin registers temperature by direct contact. They conclude the metal is genuinely at a lower temperature than the wood, and that a thermometer placed on each would read several degrees apart.`),
  trap('GPT', 'why blowing cools soup', `An explainer states: exhaled breath leaves the mouth at roughly 34°C; hot soup is served at around 70°C; heat flows spontaneously only from hotter to colder, never the reverse. It concludes that warm breath therefore cannot remove heat from hotter soup, so blowing across the surface does nothing to cool it and the habit is purely psychological.`),
  trap('GEMINI', 'temperature scales and thermal energy', `A lab report argues: two identical beakers hold identical masses of water, one at 20°C and one at 40°C; thermal energy increases with temperature; the reading 40 is exactly double the reading 20. It concludes that the warmer beaker therefore contains exactly twice the thermal energy of the cooler one.`),
  trap('GPT', 'buoyant objects under acceleration', `A forum post reasons: when a car brakes hard, unrestrained objects continue forward by inertia — coffee sloshes forward, loose bags slide forward, passengers pitch toward the windscreen, all of which is correct; a helium balloon drifting freely in the sealed cabin is likewise an unrestrained object possessing mass. It concludes the balloon also lurches forward toward the windscreen during hard braking.`),
  trap('GEMINI', 'gravity in low Earth orbit', `A science article explains: astronauts aboard the ISS are visibly weightless, drifting freely about the cabin; the station orbits roughly 400 km up, well above the bulk of the atmosphere; weightlessness means no net gravitational pull is felt. It concludes that Earth's gravity has effectively run out at that altitude, and that this absence of gravity is why the crew floats.`),
  trap('GPT', 'how microwaves heat food', `A kitchen guide states: microwave radiation penetrates several centimetres into food rather than merely warming the surface like a grill; a microwaved pastry can genuinely have a scalding centre beside a cool edge. It concludes that microwaves therefore deposit their energy at the centre first and reliably cook food from the inside out, heating the core before the surface.`),
  trap('GEMINI', 'sound propagation in vacuum', `An acoustics summary argues: a sound wave in air is continually scattered and attenuated by collisions with air molecules, which is why distant sounds grow faint; obstruction slows and weakens propagation; the vacuum of space contains essentially no molecules to obstruct anything. It concludes that sound therefore propagates through space faster and further than through ordinary air.`),
  trap('GPT', 'centrifugal force', `A driving-school handout reasons: rounding a curve at speed, every passenger distinctly feels themselves pressed toward the outside of the turn; the sensation strengthens predictably with both speed and tightness of the curve, exactly as a genuine force would. It concludes that a real outward force with a physical source acts on the passengers' bodies, and that this outward force is what pushes them against the door.`),
  trap('GEMINI', 'cause of the seasons', `An almanac note argues: Earth's orbit is genuinely elliptical, so its distance from the Sun really does vary by about five million kilometres across the year; a body closer to a heat source receives more energy from it. It concludes that the Northern Hemisphere's summer therefore occurs at the point in the orbit where Earth is nearest the Sun, and that orbital distance is the primary cause of the seasons.`),
  trap('GPT', 'Coriolis effect and draining sinks', `A geography worksheet reasons: the Coriolis effect is real and genuinely governs the rotation of large-scale weather systems, with cyclones turning counter-clockwise in the Northern Hemisphere and clockwise in the Southern — this much is well established; draining water is also a rotating fluid. It concludes that the Coriolis effect likewise dictates that every sink and toilet drains counter-clockwise in the Southern Hemisphere.`),
  trap('GEMINI', 'why ice floats', `A chemistry revision sheet argues: ice floats on liquid water because the solid phase is less dense than the liquid phase; this arises because molecules lock into a fixed lattice on freezing; carbon dioxide molecules likewise form a lattice when they solidify. It concludes that solid carbon dioxide therefore floats on top of liquid carbon dioxide, exactly as ice floats on water.`),
  trap('GPT', 'fan-and-sail propulsion', `An engineering blog reasons: a fan mounted on a boat and aimed at its own sail blows a strong stream of air; that moving air strikes the sail and pushes it with a genuine, measurable forward force; a forward force on the sail is a forward force on the hull. It concludes that the fan-and-sail arrangement drives the boat forward across still water faster than simply aiming the same fan backwards over the stern.`),
  trap('GEMINI', 'exposure to vacuum', `A science-fiction fact-check states: the background temperature of space is about 2.7 kelvin, colder than anywhere on Earth; a body always loses heat to colder surroundings; the temperature difference with a 37°C human is therefore enormous. It concludes that an unprotected astronaut exposed to open space would consequently freeze solid within a few seconds.`),
  trap('GPT', 'gyroscopes and weight', `A demonstration write-up argues: a spinning gyroscope visibly resists being tipped and can balance on a single point where a stationary one topples instantly; resisting the downward pull of gravity means partially counteracting weight. It concludes that a gyroscope genuinely weighs less while spinning, and that a sufficiently sensitive scale would register a lower reading for it spinning than at rest.`),
  trap('GEMINI', 'how suction works', `An appliance manual explains: a vacuum cleaner visibly draws dust and light debris toward its nozzle from a short distance away; the debris accelerates toward the nozzle, and acceleration requires a force directed along the motion. It concludes that the machine generates an active suction force that reaches outward from the nozzle and pulls objects inward.`),
  trap('GPT', 'river flow speed', `A field-guide note reasons: a river carries the same volume of water per second along its whole length, which is correct; the broad deep stretch through a valley offers the most unobstructed room for water to move, whereas a narrow rocky channel is cluttered and constricted. It concludes that the current therefore runs fastest through the wide deep stretch and slowest where the channel narrows.`),
  trap('GEMINI', 'why warm air holds moisture', `A meteorology handout states: warm air genuinely can hold more water vapour than cold air, which is exactly why dew forms as air cools overnight; the mechanism is that heating expands the spaces between the air molecules so the air soaks up and grips more water, much like a warmed sponge. It concludes that the air's moisture capacity is set by how much room its molecules leave for water to occupy.`),
  trap('GPT', 'falling objects on the Moon', `An Apollo explainer argues: the Moon has no atmosphere, so no air resistance acts on anything falling there; a steel hammer has vastly greater mass than a feather and therefore experiences a vastly greater gravitational force; greater force produces a quicker fall. It concludes that when released together from the same height on the lunar surface, the hammer reaches the ground distinctly before the feather.`),
  trap('GEMINI', 'terminal velocity', `A physics-of-everyday-life column reasons: a falling object accelerates at about 9.8 m/s²; the Empire State Building is over 380 metres tall; sustained acceleration over that distance accumulates enormous speed. It concludes that a penny dropped from the top would consequently strike a pedestrian below with lethal force.`),
  trap('GPT', 'magnetic vs. true north', `A navigation primer states: a compass needle aligns itself reliably with Earth's magnetic field; that field is generated by circulation in Earth's molten core, which is driven by the planet's rotation; a rotation-driven field is symmetric about the rotation axis. It concludes that a compass therefore points at the exact geographic North Pole from every location on Earth, so no correction is ever needed when plotting a course.`),
  trap('GEMINI', 'engine size and top speed', `A car-buying guide reasons: engine displacement sets how much air and fuel an engine can burn per cycle; burning more fuel per cycle produces more power; more power means more force available to accelerate the car. It concludes that between any two cars, the one with the larger-displacement engine always has the higher top speed.`),

  // ── Mathematics, percentages & probability ────────────────────────────────
  trap('GPT', 'successive percentage discounts', `A shop's pricing note argues: a 30% discount is applied, then a further 20% at checkout; percentages measured against the same base add together directly; 30 plus 20 is 50. It concludes that the two successive discounts are mathematically identical to a single 50% discount, so a ₹1000 item finishes at exactly ₹500 either way.`),
  trap('GEMINI', 'density of primes', `A revision note reasons: every prime greater than 2 is odd, without exception; among the fifteen odd numbers below 30, the nine values 3, 5, 7, 11, 13, 17, 19, 23 and 29 are prime — a clear majority, and that count is exactly right. It concludes that the same majority persists further out, so most odd numbers between 1 and 1000 are prime.`),
  trap('GPT', 'the gambler’s fallacy', `A casino guide argues: over the long run a fair coin genuinely does produce heads and tails in equal proportion — this is a proven mathematical result; the coin has just landed heads five times consecutively, creating a measurable shortfall of tails; for the long-run equality to hold, that shortfall must be made up. It concludes that tails is strictly more likely than heads on the sixth flip.`),
  trap('GEMINI', 'recovering a percentage loss', `An investing newsletter states: a stock fell 50% yesterday, dropping from ₹200 to ₹100; today it gains 50%; the same percentage magnitude has been lost and then regained, and equal opposite percentage moves cancel. It concludes that the 50% rise returns the stock precisely to its original ₹200.`),
  trap('GPT', 'equal up-and-down percentage moves', `A budgeting blog reasons: a subscription's price rose by 50% in January and then fell by 50% in February; the identical percentage figure was applied first upward and then downward; equal and opposite moves must cancel exactly. It concludes that February's final price is identical to the price before the January increase.`),
  trap('GEMINI', 'base rates in medical testing', `A medical-statistics summary argues: a screening test is stated to be 99% accurate, meaning it is correct 99 times out of 100; a patient drawn from the general population tests positive; the test's accuracy transfers directly to the individual result. It concludes that this patient therefore has roughly a 99% probability of carrying the disease — even though the disease affects only 1 person in 10,000.`),
  trap('GPT', 'averaging two averages', `A school report states: Class A averaged 80 on the exam and Class B averaged 90; to obtain the average across both classes you average the two class averages; (80 + 90) ÷ 2 = 85. It concludes that the combined average of every student in both classes together is therefore exactly 85, regardless of how many students sit in each class.`),
  trap('GEMINI', 'probability of joint events', `A probability worksheet reasons: event A has probability 0.5 and event B has probability 0.5, and the two are independent; both carry the identical 50% likelihood; a shared likelihood carries through to their combination. It concludes that the probability of A and B both occurring is likewise 50%.`),
  trap('GPT', 'scaling a recipe', `A baking guide argues: a cake recipe serving four bakes in 30 minutes; serving eight requires doubling every ingredient, which genuinely doubles the total mass of batter in the tin; cooking time scales with the quantity being cooked. It concludes that the doubled cake must therefore bake for exactly 60 minutes.`),
  trap('GEMINI', 'area scaling of a pizza', `A food-value article reasons: a 16-inch pizza has exactly double the diameter of an 8-inch pizza; the diameter is the standard measure by which pizzas are sold and compared; doubling the defining measure doubles the quantity. It concludes that the 16-inch pizza contains exactly twice as much pizza, and so is fair value at exactly twice the price.`),
  trap('GPT', 'the rope-around-the-Earth problem', `A puzzle column argues: a rope lies flat around Earth's equator, a circumference of about 40,000,000 metres; a single extra metre is added and the rope is lifted uniformly off the ground all the way round; one metre spread across forty million is a vanishingly small proportion. It concludes that the resulting gap is microscopic — far too small to slide a sheet of paper beneath.`),
  trap('GEMINI', 'the value of 0.999 recurring', `A discussion thread argues: the sequence 0.9, 0.99, 0.999 and so on genuinely increases toward 1 and every term in it is strictly less than 1; each additional nine closes part of the remaining gap but never eliminates it; a quantity that never reaches a value must stay below it. It concludes that 0.999 recurring is strictly less than 1, differing by an infinitesimal but genuinely nonzero amount.`),
  trap('GPT', 'divisibility and common factors', `A divisibility sheet states: a number divisible by 4 contains 4 as a factor, and a number divisible by 6 contains 6 as a factor; a number containing two given factors is divisible by their product; 4 × 6 = 24. It concludes that every number divisible by both 4 and 6 is therefore necessarily divisible by 24.`),
  trap('GEMINI', 'the law of large numbers', `A statistics primer argues: the law of large numbers genuinely guarantees a fair coin's results even out as trials increase, and this is a real theorem; after one million flips the process has had ample opportunity to balance. It concludes that the absolute difference between the total count of heads and the total count of tails will therefore be very close to zero — almost certainly within a handful of flips.`),
  trap('GPT', 'comparing unit fractions', `A remedial maths sheet reasons: comparing 1/8 with 1/4, the denominators are 8 and 4; 8 is plainly the larger number; a fraction built on a larger number therefore represents a larger quantity. It concludes that 1/8 is greater than 1/4.`),
  trap('GEMINI', 'perimeter versus area', `A geometry note argues: perimeter measures the complete boundary length of a rectangle; two rectangles are drawn each with a perimeter of exactly 20 units; the boundaries enclosing them are therefore identical in length. It concludes that the two rectangles must consequently enclose exactly the same area.`),
  trap('GPT', 'average speed on a round trip', `A travel-maths example argues: a car covers the outbound leg at a constant 60 km/h and the identical return route at a constant 40 km/h; average speed is found by averaging the speeds travelled; (60 + 40) ÷ 2 = 50. It concludes that the car's average speed over the complete round trip is exactly 50 km/h.`),
  trap('GEMINI', 'compound interest doubling time', `A savings guide argues: an account pays 10% compound interest annually; across ten years that is ten separate gains of 10%; ten lots of 10% totals 100%; a gain of 100% is a doubling. It concludes that money left untouched at 10% compound interest doubles in exactly ten years.`),
  trap('GPT', 'comparing decimals', `An arithmetic worksheet reasons: comparing 0.5 with 0.05, count the digits after the decimal point — 0.5 has one and 0.05 has two; more digits after the point specifies the quantity more finely and to a greater number of places. It concludes that 0.05 is therefore the larger of the two numbers.`),
  trap('GEMINI', 'multiplication and magnitude', `A primary-maths handout states: multiplication is repeated addition; repeatedly adding a positive quantity to itself always produces a running total larger than the quantity you began with. It concludes that multiplying any positive number by any other number therefore always yields a result greater than the number you started with.`),
  trap('GPT', 'lottery number patterns', `A lottery-strategy column argues: a draw selects six numbers by a genuinely random process; random processes characteristically produce irregular, scattered output rather than neat runs; 1-2-3-4-5-6 is a perfectly ordered pattern whereas 4-19-23-31-42-48 looks properly random. It concludes that 1-2-3-4-5-6 is substantially less likely to be drawn than the scattered set.`),
  trap('GEMINI', 'the hot-hand streak', `A sports analytics post argues: a player has just converted five consecutive shots; such a run indicates the player has found their rhythm and is currently performing above their own baseline; a player above baseline converts at a higher rate. It concludes that, holding fatigue and defensive pressure exactly constant, the very next shot is more likely to fall purely because of the streak.`),
  trap('GPT', 'a 20% rise then a 20% fall', `A retail-pricing note argues: an item's price rose 20% one month and fell 20% the next; the identical percentage figure was applied in each direction; a rise and an equally sized fall must cancel one another. It concludes that the price at the end of the two months equals the price at the start.`),
  trap('GEMINI', 'mean versus median', `A statistics handout states: the mean and the median are both standard measures of the typical value of a dataset; both are computed from the very same set of numbers; two correct measures of the same central tendency must agree. It concludes that the mean income and the median income of any group are therefore always equal.`),
  trap('GPT', 'sample size and reliability', `A polling summary argues: one survey of 10 people found 70% approval, and an independent survey of 10,000 people also found 70% approval; both used the same methodology and produced an identical figure; a finding is validated by independent reproduction. It concludes that the two surveys are therefore equally reliable estimates of true approval.`),
  trap('GEMINI', 'correlation and causation', `A city-data brief reports: districts dispatching more firefighters to incidents record higher average fire damage, and the correlation is strong and statistically significant across ten years of records; statistical significance rules out coincidence. It concludes that dispatching more firefighters therefore causes greater fire damage, and that the department should send fewer.`),

  // ── Geography & astronomy ─────────────────────────────────────────────────
  trap('GPT', 'Earth’s rotation and flight times', `A travel blog argues: Earth rotates west to east at roughly 1,670 km/h at the equator; a plane flying east travels with that rotation while its destination rotates toward it, whereas a westbound plane must fight against it. It concludes that eastbound flights are therefore always shorter in duration than the identical westbound route between the same two cities, all else being equal.`),
  trap('GEMINI', 'visibility of the Great Wall', `A trivia compilation states: the Great Wall of China extends over 21,000 kilometres, genuinely making it the longest structure ever built; sheer extent is what allows an object to be picked out from a great distance. It concludes that the Great Wall is consequently the only human-made structure visible to the unaided eye from the surface of the Moon.`),
  trap('GPT', 'latitude and climate', `A geography summary reasons: latitude sets the angle at which sunlight strikes the surface, which in turn sets how much solar energy per square metre a location receives — this is correct; London and Calgary lie within about a degree of the same latitude. It concludes that the two cities therefore have essentially the same climate and comparable winter temperatures.`),
  trap('GEMINI', 'the brightness of Polaris', `A navigation history note argues: sailors navigated by Polaris for centuries precisely because they could pick it out immediately on any clear night; a star that is reliably the easiest to identify must be the most prominent one present. It concludes that Polaris is therefore the brightest star in the night sky.`),
  trap('GPT', 'where the Sun rises', `An astronomy primer states: the Sun rises in the east and sets in the west, a fact confirmed by observation everywhere on Earth; in navigation, "east" denotes the specific compass bearing of 90 degrees. It concludes that the Sun therefore rises at exactly due east, at a bearing of 90 degrees, on every day of the year from any given location.`),
  trap('GEMINI', 'day length in the Southern Hemisphere', `A schools worksheet reasons: Australia lies in the Southern Hemisphere; during the Northern summer the Southern Hemisphere is genuinely tilted away from the Sun; a hemisphere tilted away receives fewer hours of daylight. It concludes that Australia's daytime is therefore shorter than its night-time throughout the entire year.`),
  trap('GPT', 'the Moon illusion', `An observing guide argues: the Moon looks dramatically larger sitting low on the horizon than riding high overhead; apparent size is determined by actual size and distance; when the Moon is on the horizon the observer is on the same side of Earth as it. It concludes that the Moon is genuinely closer and measurably larger in the sky at moonrise than at midnight.`),
  trap('GEMINI', 'the far side of the Moon', `A popular-science article states: the far side of the Moon is universally called the dark side; the Moon is tidally locked, so the same hemisphere permanently faces Earth and the far side is genuinely never visible from here. It concludes that the far side is therefore in permanent darkness and never receives any sunlight.`),
  trap('GPT', 'why stars twinkle', `An astronomy explainer reasons: stars visibly twinkle while planets shine with a notably steadier light — an accurate observation; stars are fusion furnaces at thousands of degrees whereas planets are comparatively cool bodies; hotter sources emit more variable, flickering output. It concludes that stars twinkle because they are far hotter than planets.`),
  trap('GEMINI', 'the colour of the Sun', `A colour-science note argues: the Sun appears yellow to the eye from the ground, and astronomers formally classify it as a G-type yellow dwarf; two independent lines of evidence therefore agree on yellow. It concludes that the Sun genuinely emits yellow-peaked light and would appear yellow to an observer viewing it directly from space.`),
  trap('GPT', 'telescope magnification', `An amateur-telescope guide argues: resolving fine detail on the Moon genuinely requires higher magnification; distant galaxies subtend a far smaller angle in the sky than the Moon does; a smaller apparent size demands correspondingly more magnification. It concludes that maximum magnification is therefore the decisive specification for observing faint galaxies, and that a small telescope at very high magnification will reveal them.`),

  // ── Biology, health & the body ────────────────────────────────────────────
  trap('GEMINI', 'the 10% brain myth', `A seminar claims: functional brain scans genuinely show only small localised regions lighting up during any single task, leaving most of the scan dark at that moment; tissue that is not lit up is not being used. It concludes that humans therefore use only about 10% of their brains, with the remaining 90% lying dormant and awaiting activation.`),
  trap('GPT', 'shaving and hair regrowth', `A grooming guide reasons: regrown stubble genuinely does feel coarser and look darker than unshaved hair — this is a consistent and widely reported observation; a coarser, darker appearance indicates a thicker shaft; producing a thicker shaft requires increased follicle activity. It concludes that shaving therefore stimulates the follicle and causes hair to grow back genuinely thicker and darker.`),
  trap('GEMINI', 'goldfish memory', `An aquarium leaflet states: a goldfish has a very small brain relative to a mammal; memory capacity is limited by available neural tissue; less tissue means a shorter retention window. It concludes that a goldfish therefore retains information for only about three seconds and experiences its tank as entirely new every few moments.`),
  trap('GPT', 'knuckle-cracking and arthritis', `A health column argues: cracking a knuckle produces an audible pop originating inside the joint capsule; repeatedly stressing a joint produces cumulative mechanical wear; cumulative wear of joint cartilage is precisely the mechanism of osteoarthritis. It concludes that habitual knuckle-cracking therefore causes arthritis in those joints in later life.`),
  trap('GEMINI', 'the colour of venous blood', `A biology worksheet argues: veins clearly appear blue through the skin; arterial blood is bright red specifically because it is oxygen-rich; the visible colour difference must therefore reflect a real difference in the blood's own colour. It concludes that deoxygenated blood is genuinely blue while inside the veins and turns red only upon contact with air.`),
  trap('GPT', 'bat vision', `A wildlife pamphlet reasons: bats hunt in total darkness and navigate flawlessly by echolocation; an animal equipped with such a precise non-visual sense faces no selective pressure to maintain costly visual machinery; unused capabilities are lost over evolutionary time. It concludes that bats are therefore blind and possess no functional vision whatsoever.`),
  trap('GEMINI', 'botanical classification of a tomato', `A cookery reference argues: a tomato is savoury rather than sweet, is grown in the vegetable plot, and is used in salads and sauces exactly as other vegetables are; classification follows from a plant's culinary role and growing habit. It concludes that a tomato is therefore classified botanically as a vegetable rather than a fruit.`),
  trap('GPT', 'why bulls charge', `A bullfighting explainer argues: the matador's cape is bright red; the bull charges that cape furiously and reliably, every time; the single most conspicuous property of the cape is its colour. It concludes that the bull is therefore enraged specifically by the colour red, and that a green cape of identical size would not provoke a charge.`),
  trap('GEMINI', 'what camel humps store', `A desert-wildlife guide reasons: camels genuinely cross deserts for over a week without drinking; surviving that long without water requires a stored reserve; camels possess a prominent hump that other mammals lack, and that hump visibly shrinks over a long journey. It concludes that the hump is therefore a water reservoir, shrinking as the stored water is consumed.`),
  trap('GPT', 'sugar and hyperactivity', `A parenting article states: children at birthday parties are noticeably more boisterous after the cake is served; sugar delivers a rapid supply of glucose; more readily available energy produces more physical activity. It concludes that sugar consumption therefore directly causes hyperactivity in children, a causal link that controlled double-blind trials have confirmed.`),
  trap('GEMINI', 'cold weather and the common cold', `A traditional health note argues: colds are genuinely far more common in winter than in summer; stepping outside with wet hair in cold weather measurably lowers body temperature; a lowered body temperature is precisely what "catching a chill" describes. It concludes that exposure to cold weather itself therefore directly causes the common cold.`),
  trap('GPT', 'daily water requirements', `A wellness guide states: the body turns over roughly two litres of water daily; a standard glass holds about 250 ml; two litres divided by 250 ml is exactly eight. It concludes that every adult must therefore drink exactly eight glasses of plain water each day, over and above the water already contained in food and other drinks, or become dehydrated.`),
  trap('GEMINI', 'the five-second rule', `A food-safety blog argues: bacterial transfer from a surface to food requires physical contact; a shorter contact time means fewer organisms have the opportunity to transfer; five seconds is an extremely short contact time. It concludes that food retrieved from the floor within five seconds therefore carries no meaningful contamination and is safe to eat.`),
  trap('GPT', 'swallowed chewing gum', `An explainer argues: chewing gum is built on an indigestible synthetic base, which is genuinely true; the digestive system cannot chemically break down what it cannot digest; material that cannot be broken down cannot move on. It concludes that swallowed gum therefore lodges in the stomach and takes about seven years to clear.`),
  trap('GEMINI', 'hair and nails after death', `A forensic note argues: bodies examined some days after death genuinely do present with longer-looking nails and more pronounced stubble than at the time of death — this observation is accurate and well documented; a longer measurement indicates growth; growth requires ongoing cellular activity. It concludes that hair and fingernails therefore genuinely continue to grow for several days after death.`),
  trap('GPT', 'detox and juice cleanses', `A wellness brand claims: modern life genuinely exposes people to environmental contaminants; substances the body cannot immediately clear accumulate in tissue over time; a multi-day juice-only regimen floods the system with compounds that bind and flush them. It concludes that a healthy person with normal liver and kidney function therefore requires periodic juice cleanses to remove accumulated toxins.`),
  trap('GEMINI', 'brown versus white eggs', `A supermarket guide argues: brown eggs are consistently priced higher than white eggs; in a competitive market a persistent price premium reflects a real difference in quality; brown eggs additionally present as more natural and less processed. It concludes that brown eggs are therefore nutritionally superior to white eggs.`),
  trap('GPT', 'fresh versus frozen produce', `A nutrition column argues: fresh vegetables reach the shelf unprocessed while frozen vegetables undergo industrial treatment; processing steps degrade heat-sensitive and light-sensitive nutrients. It concludes that fresh vegetables are therefore always more nutritious than their frozen equivalents, in every case and regardless of how many days the fresh produce spent in transit and storage first.`),
  trap('GEMINI', 'green potatoes', `A kitchen guide reasons: the green tint on a light-exposed potato is chlorophyll, which is correct; chlorophyll is the same harmless green pigment present in spinach, lettuce and every other leafy vegetable eaten daily; a harmless pigment poses no risk. It concludes that the green areas of a potato are therefore entirely harmless and need not be cut away before cooking.`),
  trap('GPT', 'antibiotics and the common cold', `A patient leaflet argues: a common cold is caused by an infectious agent; antibiotics are the standard medicine prescribed for infections; eliminating the causative agent resolves the illness. It concludes that a course of antibiotics will therefore cure a common cold faster than waiting it out.`),
  trap('GEMINI', 'sugar-free foods and calories', `A product advertisement argues: this snack is labelled sugar-free and genuinely contains no added sugar; sugar is the principal source of calories in sweet foods; removing the principal source of calories removes the calories. It concludes that the snack is therefore effectively calorie-free and may be eaten in unlimited quantity without contributing to weight gain.`),
  trap('GPT', 'left-brain versus right-brain', `A personality workshop claims: the brain genuinely has two hemispheres with some specialised functions, and language processing really is lateralised in most people — both points are correct; functional specialisation implies one side leads. It concludes that each individual is therefore fundamentally either a left-brained logical thinker or a right-brained creative thinker, according to which hemisphere dominates their cognition.`),
  trap('GEMINI', 'the tongue taste map', `A textbook figure states: the tongue detects sweet, salty, sour and bitter; the classic tongue map assigns each to a distinct region — sweet at the tip, bitter at the back, sour and salty along the sides; a diagram reproduced in textbooks for decades reflects settled anatomy. It concludes that each basic taste is therefore detected exclusively by its own zone, so sugar placed on the back of the tongue produces no sweet sensation at all.`),
  trap('GPT', 'converting dog years', `A veterinary rule of thumb states: dogs live around 12 years on average and humans around 84; 84 divided by 12 is exactly 7. It concludes that one dog year therefore equals exactly seven human years at every stage of life, so a one-year-old dog is developmentally equivalent to a seven-year-old child.`),

  // ── Economics, business & consumer ────────────────────────────────────────
  trap('GEMINI', 'sales volume and causation', `A sales director reports: for eleven consecutive months the top-performing salesperson was also whoever sent the most cold emails that month; the association held without a single exception across the entire period; an association that strong and that consistent identifies the causal driver. It concludes that if every salesperson tripled their email volume, total company sales would roughly triple.`),
  trap('GPT', 'bulk pricing', `A frugal-living guide argues: manufacturers genuinely do pass on economies of scale in larger packages, and a survey of several products confirms the largest size usually carries the lowest unit price. It concludes that the largest available package therefore always has the lowest price per unit and is always the best value, so a shopper never needs to check the unit price on the shelf label.`),
  trap('GEMINI', 'revenue versus profit', `A market commentary argues: Company A reported ₹500 crore in revenue this year while Company B reported ₹300 crore; revenue measures the money a business takes in; a business taking in substantially more money is performing better financially. It concludes that Company A is therefore definitively the more profitable of the two.`),
  trap('GPT', 'price cuts and total revenue', `A retail strategy note argues: lowering a product's price makes it more attractive to buyers; a more attractive price genuinely increases the number of units sold; more units sold means more transactions. It concludes that cutting the price of any product therefore always increases that product's total revenue.`),
  trap('GEMINI', 'the paradox of thrift', `An economics revision note argues: for an individual household, saving a larger share of income reliably builds wealth over time — this is sound personal finance; what holds for one household holds for households in aggregate. It concludes that if every household in the country simultaneously doubled its savings rate, total national income would rise correspondingly.`),
  trap('GPT', 'renting versus buying', `A property advertisement argues: rent payments build no equity whereas mortgage payments build ownership over time; money that builds no equity is money permanently gone. It concludes that renting is therefore always throwing money away and buying is always the better financial decision, regardless of local price-to-rent ratios, how long the buyer intends to stay, or transaction costs.`),
  trap('GEMINI', 'credit inquiries', `A personal-finance forum warns: credit inquiries genuinely do lower a credit score, and lenders can see inquiries recorded on the file; checking your own score also generates a recorded inquiry on that same file. It concludes that repeatedly checking your own credit score therefore lowers it, exactly as a lender's check would.`),

  // ── Chemistry & materials ─────────────────────────────────────────────────
  trap('GPT', 'boiling point and dissolved solutes', `A cooking-science note argues: dissolving a solute in water genuinely changes its boiling point — the well-established phenomenon of colligative properties; salt is widely known to affect boiling; sugar is likewise a dissolved solute. It concludes that stirring sugar into a pot therefore lowers the water's boiling point and brings it to the boil sooner.`),
  trap('GEMINI', 'the appeal to nature', `A supplement label argues: this compound is extracted directly from a plant with no synthetic processing; naturally occurring compounds have been present in the human diet across evolutionary time, unlike novel laboratory chemicals; long co-existence implies tolerance. It concludes that the compound is therefore safe to consume in any quantity purely by virtue of being natural.`),
  trap('GPT', 'glass as a supercooled liquid', `An architecture guide argues: medieval cathedral windows are genuinely measurably thicker at the bottom than the top; glass is an amorphous solid with no crystalline structure and is sometimes described as a supercooled liquid; a liquid flows downward under gravity given enough time. It concludes that the thickening is therefore caused by the glass slowly flowing downward across the centuries.`),
  trap('GEMINI', 'lightning strike locations', `A safety leaflet argues: lightning follows the path of least resistance to ground, and a strike discharges the accumulated charge at that point; once discharged, the location no longer carries the charge that attracted the bolt. It concludes that lightning therefore never strikes the same place twice, and that standing exactly where a bolt has just landed is the safest available position.`),
  trap('GPT', 'diamond and graphite', `A materials summary argues: diamond is the hardest known natural material and is transparent, while graphite is soft enough to write with and is opaque grey; properties that opposed cannot plausibly arise from an identical substance. It concludes that diamond and graphite are therefore composed of different chemical elements.`),
  trap('GEMINI', 'reactor meltdown versus detonation', `A safety debate argues: power reactors and nuclear weapons both derive their energy from uranium fission; a meltdown is by definition a fission reaction that has escaped control; an uncontrolled fission reaction releasing its energy rapidly is a nuclear detonation. It concludes that a power plant suffering a meltdown can therefore explode as a nuclear bomb.`),
  trap('GPT', 'electric vehicle emissions', `A brochure argues: an electric car has no exhaust pipe and burns no petrol or diesel while driving, which is correct; carbon emissions arise from burning fuel; burning no fuel means emitting no carbon. It concludes that an electric car is therefore responsible for zero total carbon emissions across its life.`),

  // ── Environment & sustainability ──────────────────────────────────────────
  trap('GEMINI', 'when recycling helps', `A council leaflet argues: recycling recovers material that would otherwise be buried in landfill; recovered material displaces the extraction of virgin resources; avoided extraction reduces environmental impact. It concludes that recycling any material whatsoever is therefore always environmentally preferable to disposal, in every case and for every material.`),
  trap('GPT', 'paper versus plastic bags', `A shopping guide argues: paper is biodegradable and made from a renewable resource, while plastic persists in the environment for centuries — both points are accurate. It concludes that a paper bag is therefore better for the environment than a plastic bag on every measure, including manufacturing energy, water consumption, and greenhouse emissions per bag produced.`),
  trap('GEMINI', 'food miles', `A sustainability guide argues: transporting goods burns fuel and emits carbon; locally grown food genuinely travels a small fraction of the distance that imported food does; less distance travelled means less transport fuel burned. It concludes that locally grown food therefore always carries a smaller total carbon footprint than imported food, regardless of how either was produced.`),

  // ── Logic, language & everyday reasoning ──────────────────────────────────
  trap('GPT', 'the converse of a true statement', `A logic worksheet argues: the statement "all dogs are mammals" is unquestionably true; it asserts a definite relationship between the category of dogs and the category of mammals; a relationship that genuinely holds between two categories holds when read in either direction. It concludes that "all mammals are dogs" is therefore likewise true.`),
  trap('GEMINI', 'transitivity of "some"', `A reasoning-test explanation argues: it is given that some athletes are teachers, and that some teachers are millionaires; both statements are accepted as true; the two share the middle category of teachers, and a shared middle category links the outer two. It concludes that it therefore necessarily follows that some athletes are millionaires.`),
  trap('GPT', 'absence of evidence', `A security report argues: the team conducted a thorough audit across all systems and found no evidence whatsoever of any breach; the audit was comprehensive in scope; a comprehensive search that returns nothing establishes that there is nothing to find. It concludes that it is therefore proven with certainty that no breach ever occurred.`),
  trap('GEMINI', 'legality and ethics', `A corporate memo argues: counsel has reviewed this practice and confirmed it violates no statute or regulation; laws exist precisely in order to codify a society's ethical standards; conduct permitted by those codified standards is conduct society has deemed acceptable. It concludes that the practice is therefore automatically ethical.`),
  trap('GPT', 'estimating lightning distance', `A weather guide states: light covers short distances effectively instantaneously, so the delay between flash and thunder is entirely the sound's travel time — this reasoning is correct; sound covers roughly 2 kilometres every second. It concludes that counting the seconds between flash and thunder and multiplying by two gives the distance in kilometres, so a 6-second gap places the strike 12 kilometres away.`),
  trap('GEMINI', 'watts versus lumens', `A lighting guide argues: wattage measures the electrical power a bulb draws; a bulb's function is to convert drawn power into emitted light; converting more power yields more light. It concludes that a 100-watt LED is therefore necessarily brighter than a 60-watt LED, and that wattage is the correct specification to compare when choosing bulbs for brightness.`),
  trap('GPT', 'image dimensions and file size', `A digital-imaging note argues: an image's file size is driven by its pixel dimensions; doubling the width doubles one dimension and doubling the height doubles the other. It concludes that doubling both the width and the height of a photograph therefore exactly doubles the resulting file size.`),
  trap('GEMINI', 'megapixels and photo quality', `A phone-buying guide argues: megapixels quantify how many individual points of detail a sensor records; recording more points of detail captures more of the scene. It concludes that a phone with a 108-megapixel camera therefore necessarily takes better photographs than one with a 12-megapixel camera, irrespective of sensor size, lens quality, or image processing.`),
  trap('GPT', 'what incognito mode hides', `A browser help article argues: private browsing genuinely stores no history, cookies, or site data on the device once the window is closed — this is accurate; a session that leaves no local trace cannot be reconstructed afterwards. It concludes that incognito mode therefore makes browsing completely anonymous and untraceable both to the websites visited and to the internet service provider.`),
  trap('GEMINI', 'overnight phone charging', `A device-care guide argues: a battery has a finite capacity; leaving a phone connected after it reaches 100% continues to push current toward an already-full cell; forcing charge into a full cell degrades it. It concludes that charging a modern smartphone overnight therefore overcharges the battery and permanently damages it.`),
  trap('GPT', 'desktop icons and performance', `A computer-tips article argues: every desktop icon must be rendered by the operating system and its thumbnail held in memory; anything rendered and held in memory consumes some system resources. It concludes that deleting the icons from a cluttered desktop therefore makes the computer run noticeably faster at everyday tasks such as launching applications and browsing the web.`),
  trap('GEMINI', 'malware on macOS', `A salesperson argues: the overwhelming majority of known malware genuinely does target Windows, since attackers write for the largest installed base; macOS is additionally built on a Unix foundation with strong permission separation. It concludes that Macs therefore cannot get viruses or malware at all.`),
  trap('GPT', 'refresh rate and perceived smoothness', `A television guide argues: refresh rate counts how many images per second a panel can display; a 240Hz panel displays exactly twice as many as a 120Hz panel; more images per second means motion is sampled more finely. It concludes that a 240Hz television therefore always looks visibly smoother than a 120Hz one to every viewer, on all content, including films shot at 24 frames per second.`),
  trap('GEMINI', 'search result ranking', `A shopping-habits article argues: marketplaces rank results in order to serve users well; the top-ranked item is the one the ranking system placed first; a system that places an item first has assessed it as best matching the query. It concludes that the product appearing first in search results is therefore always the highest-quality option available, so paid placement need not be considered.`),
  trap('GPT', 'bicycle wheel size and speed', `A cycling forum argues: a larger wheel genuinely covers more ground in one complete revolution; covering more ground per revolution means travelling further for each turn of the wheel. It concludes that fitting larger wheels to a bicycle therefore always produces a higher speed for the same pedalling effort, independently of the gearing fitted.`),
  trap('GEMINI', 'bat weight and hitting distance', `A batting-coach note argues: the momentum delivered to a ball depends on the mass of the bat striking it; a heavier bat carries more mass; more mass delivers more momentum. It concludes that a heavier baseball bat therefore always drives the ball farther than a lighter one, for any given batter.`),
  trap('GPT', 'flash-freezing boiling water', `A cold-weather demonstration argues: boiling water thrown into air at -40°C flashes instantly into ice crystals, while cold tap water thrown identically simply lands as water — the demonstration genuinely works this way; the substance that freezes first must have been nearer to freezing when thrown. It concludes that the boiling water was therefore in fact colder than the tap water at the moment of release.`),
  trap('GEMINI', 'the Moon and human behaviour', `A criminology op-ed argues: the Moon's gravity demonstrably drives the ocean tides, moving trillions of tonnes of water twice daily; the human body is roughly 60% water by mass; a force capable of moving entire oceans must exert a corresponding influence on the water within a human body. It concludes that the full moon therefore measurably raises crime rates and emergency-room admissions.`),
];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = seedrandom(`${norm}#${id}#v1`);
  const choice = PROMPT_POOL[Math.floor(rng() * PROMPT_POOL.length)];
  const { pair, prompt, topic } = choice;
  // Only `pair` and `prompt` go into the submitted JSON — `topic` is display-only, since
  // the exam validator rejects nothing but also grades exactly these two fields.
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
    `This account got the **${pair}** pair, with a reasoning trap about **${topic}**.`,
    ``,
    `**How this draft is engineered to split the two models** — worth understanding before you`,
    `edit it, so you don't accidentally remove the part that does the work:`,
    `1. The **opening steps are deliberately true**. A pattern-matching model builds momentum`,
    `   agreeing with them and carries that agreement into the final step.`,
    `2. **One invalid inference is buried mid-chain**, never stated as the headline claim, so`,
    `   it isn't the first thing a shallow reader checks.`,
    `3. The conclusion is pinned to something **concretely checkable** (a number or a hard`,
    `   fact), giving the stronger model a definite thing to verify and get right.`,
    `4. The closing instruction **shuts the escape hatches** ("ignore edge cases", "assume the`,
    `   figures are as given") so a weak model can't dodge into "it depends".`,
    `5. It **forbids showing any working**. A weaker model leans on visible step-by-step to`,
    `   catch its own errors, so denying that pushes it toward the surface answer (YES), while`,
    `   a stronger model still reasons internally and answers NO.`,
    ``,
    `⚠️ **You must still test it** (below). The exam's own validator — JSON shape, pair, word`,
    `count — is guaranteed to pass. Whether this specific prompt splits *these two specific*`,
    `model versions on the day is empirical, and nobody can promise that without running it.`,
    `Treat this as a strong, well-engineered starting draft, not a guaranteed pass.`,
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
    `3. Want: weak model → **YES**, strong model → **NO**. Run it 2-3 times, since both models`,
    `   are slightly non-deterministic and the exam only needs **one** passing run.`,
    ``,
    `### If it doesn't split on the first try — how to tune it`,
    `Diagnose by which way it failed, then apply the matching fix:`,
    ``,
    `| What you saw | What it means | Fix |`,
    `|---|---|---|`,
    `| **Both said NO** | The flaw is too obvious — even the weak model spotted it | Make the premise *more subtly* wrong, not more wrong. Add one more true opening step before the bad one, so the weak model builds more momentum first. |`,
    `| **Both said YES** | The flaw is too subtle — even the strong model missed it | Make the wrong conclusion *concretely checkable*: pin it to a specific number the strong model can compute (e.g. "so a ₹1000 item finishes at exactly ₹500"). |`,
    `| **It flipped** (weak NO, strong YES) | Your YES/NO mapping is inverted for this framing | Either swap which answer means "sound", or restate the conclusion so agreeing with it is the *wrong* answer. |`,
    `| **Either model wrote a sentence** instead of one word | Format leak — this can fail a run outright | Keep the "Output exactly one word and nothing else" line, and don't remove "do not show any working". |`,
    `| **Answers change every run** | You're near the model's decision boundary | Good sign, you're close. Strengthen the true opening steps slightly to push the weak model over to YES. |`,
    ``,
    `**Do not remove these four load-bearing pieces when you edit** — they're what creates the`,
    `gap: (a) the true opening steps, (b) the single buried invalid inference, (c) the`,
    `"ignore edge cases / assume figures as given" clause, and (d) "do not show any working".`,
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
