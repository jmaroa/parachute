# 🚂 Parachute Trains Puzzle 🪂

A Next.js web application that visually simulates and explains the solution to the "parachute trains on a railway line" problem.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-parachute--nu.vercel.app-blue?style=for-the-badge)](https://parachute-nu.vercel.app/)

![Collision Success](https://img.shields.io/badge/Algorithm-Verified-green)
![Tests](https://img.shields.io/badge/Tests-33%20passed-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16-black)

## 📋 The Problem

A helicopter drops two trains, each on a parachute, onto a straight infinite railway line. The distance between the trains is unknown. Both trains face the same direction. When they land, each parachute detaches and stays on the track next to the train.

Each train is controlled by an identical microchip running the same program. The trains:
- ❌ Do not know their position on the line
- ❌ Do not know the distance between them
- ❌ Cannot communicate with each other
- ✅ Can only: move forward one unit, move backward one unit, or wait in place
- ✅ Can detect when they are exactly at a parachute (but cannot distinguish whose it is)

**Goal**: Design an algorithm that guarantees the two trains will eventually bump into each other.

## 🧠 The Algorithm: "Sweep & Wait"

### Core Idea

Each train executes the same algorithm:
1. **Sweep** in increasing ranges from its home parachute
2. When it finds the **other train's parachute**, it **waits there**
3. The other train will eventually return to its home parachute → **Collision!**

### How It Works

```
Phase 1:  ←|→           (1 step each direction)
Phase 2:  ←←|→→         (2 steps each direction)  
Phase 3:  ←←←|→→→       (3 steps each direction)
...and so on
```

### Why It Guarantees Collision

1. Train A is at position 0, Train B is at position D (unknown distance)
2. When `phase ≥ D`, Train A's sweep reaches position D (Train B's parachute)
3. Train A finds the foreign parachute and **WAITS**
4. Train B continues its algorithm and eventually returns to position D (its home)
5. **COLLISION** at position D ✅

### Pseudocode

```
distance_from_home = 0
phase = 1

LOOP forever:
  // Sweep FORWARD
  repeat phase times:
    move_forward()
    distance_from_home++
    if at_parachute AND distance_from_home ≠ 0:
      WAIT_HERE_FOREVER  // Found other's parachute!
  
  // Return to HOME
  repeat phase times:
    move_backward()
    distance_from_home--
  
  // Sweep BACKWARD
  repeat phase times:
    move_backward()
    distance_from_home--
    if at_parachute AND distance_from_home ≠ 0:
      WAIT_HERE_FOREVER
  
  // Return to HOME
  repeat phase times:
    move_forward()
    distance_from_home++
  
  phase++  // Increase search range
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd parachute

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run algorithm tests |
| `npm start` | Start production server |

## 🎮 How to Use

1. **Play**: Start automatic simulation
2. **Step**: Advance one step manually
3. **Reset**: Restart simulation
4. **Distance**: Adjust initial distance between trains (1-20)
5. **Speed**: Control simulation speed

Watch as the trains execute the Sweep & Wait algorithm until they collide!

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Plain CSS (no Tailwind)
- **Language**: TypeScript

## 📁 Project Structure

```
parachute/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── components/
│   ├── Train.tsx        # Animated train component
│   ├── Parachute.tsx    # Parachute marker
│   ├── Railway.tsx      # Railway visualization
│   └── Simulation.tsx   # Main simulation with controls
├── lib/
│   ├── simulation.ts    # Core algorithm & types
│   └── simulation.test.ts # Test suite (33 tests)
├── .cursor/
│   └── rules/           # Cursor AI rules
│       ├── general.mdc
│       ├── clean-code.mdc
│       └── ai-interaction.mdc
└── README.md
```

## 🧪 Testing

The project follows TDD (Test-Driven Development) principles:

```bash
npm test
```

### Test Coverage

| Suite | Tests |
|-------|-------|
| Collision - Positive Distances | 12 ✅ |
| Collision - Negative Distances | 4 ✅ |
| Edge Cases (0, 100) | 4 ✅ |
| Initial State | 10 ✅ |
| Waiting State | 2 ✅ |
| Phase Transitions | 1 ✅ |
| **Total** | **33 ✅** |

## 🤖 How Cursor AI Was Used During Development

This project was developed using **Cursor AI** as the primary coding assistant. Here's how we leveraged AI throughout the development process:

### 1. Establishing Project Rules (`.cursor/rules/`)

Before writing any code, we created custom Cursor rules to guide the AI's behavior:

#### `general.mdc`
- Project context and tech stack reference
- File structure conventions
- Framework-specific guidelines

#### `clean-code.mdc`
- **Single Responsibility Principle**: One purpose per function/component
- **DRY**: Extract repeated logic into reusable functions
- **Reuse Code**: Check existing patterns before creating new ones
- **KISS**: Prefer simple solutions over clever ones

#### `ai-interaction.mdc`
- **No Proactivity**: Always propose solutions first, wait for approval before implementing
- **Small Incremental Solutions**: Break large tasks into testable steps
- **Analyze Before Proposing**: Review existing code and patterns first
- **Verification**: Run tests and build after each change
- **Scope Discipline**: Do only what is requested, no over-engineering
- **No Assumptions**: Ask for clarification when requirements are unclear

### 2. Development Workflow

The development followed a strict **propose-then-implement** workflow:

1. **User Request**: Describe the feature or change needed
2. **AI Analysis**: Cursor analyzes existing code and patterns
3. **AI Proposal**: Cursor proposes a solution with explanation
4. **User Approval**: User reviews and approves the approach
5. **Implementation**: Only after approval, Cursor implements the solution
6. **Verification**: Run `npm test` and `npm run build` to verify

### 3. Test-Driven Development (TDD)

Cursor AI helped implement TDD:

1. **Write Tests First**: Created `simulation.test.ts` with 33 test cases
2. **Implement Algorithm**: Built the simulation engine to pass all tests
3. **Verify Continuously**: After each change, tests were run to ensure correctness

```bash
# Example test output
📊 RESULTS: 33 passed, 0 failed
```

### 4. Phased Implementation

The project was divided into clear phases:

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Algorithm Design | ✅ Sweep & Wait strategy |
| 2 | Core Logic (TDD) | ✅ `lib/simulation.ts` |
| 3 | Visualization | ✅ React components |
| 4 | Controls & Polish | ✅ UI interactions |
| 5 | Documentation | ✅ This README |

### 5. Key AI Interactions

- **Cleanup**: AI helped remove 60+ unnecessary dependencies, reducing to just 5 core packages
- **Algorithm Design**: Collaboratively designed the Sweep & Wait algorithm with visual explanations
- **Component Architecture**: AI proposed component structure following SRP
- **Testing**: AI wrote comprehensive test suites covering edge cases
- **Debugging**: AI helped fix TypeScript issues and configuration problems

### 6. What Worked Well

- **Rules-based guidance**: The `.cursor/rules/` files kept AI responses consistent and focused
- **Incremental approach**: Small, testable steps prevented bugs and made debugging easier
- **Approval workflow**: Reviewing proposals before implementation caught potential issues early
- **TDD**: Having tests first ensured the algorithm was correct before building the UI

## 📜 License

MIT License - feel free to use this project for learning or as a starting point for your own implementations.

---

Built using Next.js and Cursor AI by Mario Rodríguez
