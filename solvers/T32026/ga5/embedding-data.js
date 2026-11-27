// Fixed data for GA5 Q2 (q-ollama-faiss-rank-correlation-server). Every student's dataset is drawn from this pool of
// 60 sentences (6 per topic) and the same 10 queries, so the two models' similarity scores only ever needed computing once.
// Sentences, queries and the salt: the exam bundle. Scores (float64, little-endian: model x query x sentence, models
// nomic-embed-text then mxbai-embed-large): the precomputed table of the GA5 direct solver at
// ga5-solver-bzfe.onrender.com (its stated source sha256 36afa3b3178dc5923772203f77c87371991f5c1d5df688b377c934759e414d4d). Regenerate with a real Ollama run if the
// exam's sentence pool changes.
export const SALT = "tds-ga4-ollama-faiss-correlation-salt-2026-09";
export const MODELS = ['nomic-embed-text', 'mxbai-embed-large'];
export const DOMAINS = [
 {
  "query": "How do distributed consensus protocols handle leader election and log replication during network partitions?",
  "sentences": [
   "In the Raft consensus algorithm, log replication requires a quorum of followers to acknowledge entries before commit.",
   "Network partitions in distributed databases can cause split-brain scenarios if leader election lacks majority quorum.",
   "Paxos guarantees safety under asynchronous network conditions by employing multi-phase prepare and accept rounds.",
   "Vector clocks provide partial ordering of events in distributed systems without relying on synchronized physical clocks.",
   "Byzantine fault-tolerant protocols withstand malicious nodes by requiring two-thirds supermajority consensus.",
   "Consistent hashing distributes keys across a dynamic ring of nodes while minimizing remapping during node failures."
  ]
 },
 {
  "query": "How do B+ tree index structures and write-ahead logging optimize transaction durability and range queries in relational databases?",
  "sentences": [
   "B+ tree storage engines maintain sorted key-value pairs in leaf pages connected by bidirectional sibling pointers.",
   "Database query planners utilize index range scans to evaluate inequality predicates without full table scans.",
   "Write-ahead logging ensures atomicity and durability by persisting transaction redo records prior to flushing dirty pages.",
   "Multi-version concurrency control allows readers to view consistent snapshots without blocking concurrent write operations.",
   "Database buffer pools employ clock-sweep replacement algorithms to pin frequently accessed index pages in memory.",
   "Log-structured merge trees optimize high-throughput writes by batching updates in memory before sequential SSTable compaction."
  ]
 },
 {
  "query": "How does quantum superposition and amplitude amplification enable quadratic speedup in unstructured search algorithms?",
  "sentences": [
   "Quantum superposition allows qubits to exist in linear combinations of orthogonal basis states until measurement collapses the wave function.",
   "Grover's search algorithm achieves quadratic speedup over classical unstructured search by repeatedly applying amplitude amplification.",
   "Quantum entanglement enables non-local correlations between paired photons that violate classical Bell inequalities.",
   "Surface code quantum error correction arranges physical qubits on a two-dimensional lattice to detect stabilizer syndrome errors.",
   "Shor's quantum algorithm factors large integers in polynomial time using the quantum Fourier transform.",
   "Quantum decoherence occurs when environmental interactions cause a quantum state to lose phase coherence and behave classically."
  ]
 },
 {
  "query": "What specific electrocardiographic waveforms and serum biomarkers indicate acute myocardial infarction and ventricular arrhythmias?",
  "sentences": [
   "ST-segment elevation in precordial electrocardiogram leads typically signifies acute transmural myocardial infarction.",
   "Holter monitoring detects intermittent ventricular arrhythmias by recording cardiac electrical conduction over twenty-four hours.",
   "Atrial fibrillation is characterized by irregular R-R intervals and the complete absence of discrete P waves on the surface ECG.",
   "Serum cardiac troponin levels rise within hours of ischemic myocardial injury and serve as the gold standard biomarker.",
   "Prolongation of the corrected QT interval increases vulnerability to polymorphic ventricular tachycardia known as torsades de pointes.",
   "Echocardiography evaluates left ventricular ejection fraction and wall motion abnormalities following coronary artery occlusion."
  ]
 },
 {
  "query": "How do tandem perovskite-silicon solar cells overcome optical reflection and thermodynamic single-junction efficiency limits?",
  "sentences": [
   "Perovskite-silicon tandem photovoltaic cells exceed single-junction efficiency limits by absorbing complementary solar spectral bands.",
   "Halide perovskite semiconductors demonstrate high carrier diffusion lengths and defect tolerance suitable for thin-film solar modules.",
   "Passivated emitter and rear cell architectures reduce surface electron recombination to boost monocrystalline silicon efficiency.",
   "The Shockley-Queisser theoretical efficiency limit for a single p-n junction solar cell under standard AM1.5 sunlight is approximately thirty-three percent.",
   "Anti-reflective coatings and textured surface pyramids reduce optical reflection losses across silicon solar cell surfaces.",
   "Thermal degradation and moisture ingress remain primary degradation mechanisms limiting outdoor durability of perovskite modules."
  ]
 },
 {
  "query": "How does static single assignment (SSA) representation facilitate dead code elimination and loop-invariant code motion in optimizing compilers?",
  "sentences": [
   "Static single assignment form assigns each variable exactly once, inserting phi functions at control-flow join points.",
   "Dead code elimination algorithms remove statements whose computed values produce no observable side effects or downstream uses.",
   "Loop-invariant code motion hoists computation outside iterative loops to eliminate redundant work across loop iterations.",
   "Control flow graph dominator trees facilitate common subexpression elimination and global value numbering passes.",
   "Register allocation via graph coloring maps an arbitrary number of virtual temporary registers to a finite set of physical machine registers.",
   "Function inlining replaces subroutine call sites with the callee body to expose cross-boundary constant propagation opportunities."
  ]
 },
 {
  "query": "How do zero-knowledge SNARKs and polynomial commitment schemes prove arithmetic circuit validity without disclosing private inputs?",
  "sentences": [
   "Zero-knowledge SNARKs allow a prover to establish computational integrity of an arithmetic circuit without revealing secret inputs.",
   "Polynomial commitment schemes enable succinct verification of polynomial evaluations at random challenge points using cryptographic pairings.",
   "Elliptic curve pairings provide bilinear maps that map pairs of curve points to a target multiplicative group for cryptographic proofs.",
   "Merkle trees compute recursive cryptographic hash commitments allowing logarithmic proof of membership for leaf elements.",
   "Homomorphic encryption schemes permit arbitrary algebraic computations on ciphertexts without decrypting the underlying plaintext.",
   "Fiat-Shamir heuristics transform interactive proof protocols into non-interactive arguments by deriving challenge values from transcript hashes."
  ]
 },
 {
  "query": "How is multispectral satellite imagery calibrated and processed to calculate vegetation indices and detect surface temperature anomalies?",
  "sentences": [
   "The Normalized Difference Vegetation Index quantifies photosynthetic biomass by contrasting near-infrared reflectance with red light absorption.",
   "Synthetic aperture radar penetrates atmospheric cloud cover to measure terrestrial surface roughness and moisture content.",
   "Radiometric calibration converts raw digital sensor numbers into top-of-atmosphere radiance prior to atmospheric correction.",
   "Hyperspectral imaging sensors record hundreds of contiguous spectral bands to identify mineral compositions and soil degradation.",
   "Thermal infrared satellite bands detect surface temperature anomalies associated with urban heat islands and active wildfire perimeters.",
   "Orthorectification corrects satellite image perspective distortions caused by sensor tilt and topographical relief variations."
  ]
 },
 {
  "query": "How do central bank interest rate adjustments, quantitative easing, and Taylor rule benchmarks influence inflation expectations and bond yields?",
  "sentences": [
   "Central banks adjust policy interest rates and reserve requirements to manage interbank liquidity and anchor inflation expectations.",
   "Quantitative easing expands central bank balance sheets through sovereign bond purchases to depress long-term borrowing yields.",
   "The Phillips curve models the inverse short-run empirical relationship between unemployment rates and nominal wage inflation.",
   "Taylor rule formulas suggest benchmark central bank policy rates based on deviations of inflation and output from their targets.",
   "Cost-push inflation emerges when supply-side disruptions to raw commodities and freight shipping increase aggregate production costs.",
   "Yield curve inversions historically indicate financial market expectations of upcoming macroeconomic deceleration and recession."
  ]
 },
 {
  "query": "How do actor-critic reinforcement learning methods use baseline value functions and clipped probability ratios to stabilize policy gradients?",
  "sentences": [
   "Actor-critic architectures reduce gradient variance in policy search by utilizing a learned value function as a state baseline.",
   "Proximal Policy Optimization limits surrogate objective policy updates within a trust region via clipped probability ratios.",
   "Deep Q-networks stabilize off-policy value approximation using experience replay buffers and periodically updated target networks.",
   "Exploration-exploitation dilemmas in multi-armed bandits are balanced using upper confidence bound algorithms and Thompson sampling.",
   "Markov decision processes formalize sequential decision making under uncertainty with state transitions, action spaces, and discount factors.",
   "Generalized Advantage Estimation blends multi-step temporal difference errors to balance bias and variance in policy gradients."
  ]
 }
];
export const SCORES_SHA256 = 'f72edc433973dd83d0c656b43468f44800b8be11ea7f98f13b3e7bebc950ec4a';
export const SCORES_BASE64 =
  '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';
