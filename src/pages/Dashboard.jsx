import Thermostat from '../pages/Thermostat'

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full p-4 flex flex-col items-center justify-center">
      <div className="glass-morphism p-8 max-w-md w-full mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8 text-white">Temperature Control</h1>
        <Thermostat />
      </div>
    </div>
  )
}

export default Dashboard