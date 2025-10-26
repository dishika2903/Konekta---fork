import React from "react"
import ChatApp from "./components/ChatApp.jsx"
import ThreeBackground from "./components/ThreeBackground.jsx"
import { Canvas } from "@react-three/fiber"
import "./App.css"

function App() {
  return (
    <div className="App">
      {/* Three.js Background */}
      <div style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100vw", 
        height: "100vh", 
        zIndex: -1 
      }}>
        <Canvas>
          <ThreeBackground />
        </Canvas>
      </div>
      
      {/* Main App Structure */}
      <div className="chat-container">
        <ChatApp />
      </div>
    </div>
  )
}

export default App