import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import VehicleTable from "./components/VehicleTable";
import VehicleForm from "./components/VehicleForm";
import { FaPlus } from "react-icons/fa";

function App() {
  return (
    <Router>
      <div className='font-sans bg-blue-50 min-h-screen'>
        <Header />
        <Routes>
          <Route
            path='/'
            element={
              <>
                <button
                  onClick={() => (window.location.href = "/add")}
                  className='bg-primary text-white px-6 py-2 mb-5 mt-10 rounded-md flex justify-center items-center gap-2 hover:bg-primary/80 ml-auto mr-10'
                >
                  <FaPlus /> Add Vehicle
                </button>

                <VehicleTable />
              </>
            }
          />
          <Route path='/add' element={<VehicleForm />} />
          <Route path='/edit' element={<VehicleForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
