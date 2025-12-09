import { Simulation } from '@/components/Simulation'

export default function Home() {
  return (
    <main className="main-container">
      <Simulation initialDistance={5} />
    </main>
  )
}
