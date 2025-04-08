"use client";
import React, { useState } from "react";
import Header_loguin from "@/app/components/elements/header/Header_loguin";
import Footer_home from "@/app/components/elements/footer/Footer_home";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import FollowCursor from "@/app/components/elements/follows/Follow_basic";

interface Group {
  name: string;
  devices: string[];
}

export default function PageRecuadros() {
  const [groups, setGroups] = useState<Group[]>([
    {
      name: "Lavandería",
      devices: ["Lavadora", "Secadora", "Boiler", "Computadora, "],
    },
    {
      name: "Recamara",
      devices: ["Refrigeracion", "Xbox One", "Plancha","Nintendo Switch 2","Cargador"],
    },
  ]);

  // Estado para controlar la edición de un grupo
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedGroup, setEditedGroup] = useState<Group>({ name: "", devices: [] });
  const [newDevice, setNewDevice] = useState("");

  const handleAddGroup = () => {
    const newGroup: Group = {
      name: "Nuevo Grupo",
      devices: [],
    };
    setGroups([...groups, newGroup]);
  };

  const handleDeleteGroup = (index: number) => {
    const updatedGroups = [...groups];
    updatedGroups.splice(index, 1);
    setGroups(updatedGroups);
  };

  const handleEditGroup = (index: number) => {
    setEditingIndex(index);
    const groupToEdit = groups[index];
    setEditedGroup({ name: groupToEdit.name, devices: [...groupToEdit.devices] });
  };

  const handleSaveGroup = () => {
    if (editingIndex !== null) {
      const updatedGroups = [...groups];
      updatedGroups[editingIndex] = editedGroup;
      setGroups(updatedGroups);
      setEditingIndex(null);
      setEditedGroup({ name: "", devices: [] });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedGroup({ name: "", devices: [] });
  };

  return (
    <>
      <Header_loguin />
      <FollowCursor />
      <ThemeToggle />

      <div className="w-full min-h-screen flex flex-col items-center justify-start py-10">
        <h1 className="mb-8 font-urbanist text-3xl">Mis grupos</h1>
        
        
        <div className="flex flex-wrap gap-8 justify-center w-full px-4">
          {groups.map((group, idx) => (
            <div
              key={idx}
              className="w-64 h-80 p-6 flex flex-col rounded-xl transition-shadow hover:shadow-md"
              style={{
                border: "1px solid var(--color-v-2)",
                backgroundColor: "var(--color-bg)",
              }}
            >
              {editingIndex === idx ? (
                <>
                  <h6 className="font-bold mb-2" style={{ color: "var(--color-text)" }}>
                    Editar grupo
                  </h6>
                  <input
                    type="text"
                    value={editedGroup.name}
                    onChange={(e) =>
                      setEditedGroup({ ...editedGroup, name: e.target.value })
                    }
                    className="w-full p-1 mb-4 border rounded"
                    placeholder="Nombre del grupo"
                  />

                  <div
                    className="w-full flex-1 rounded-lg border overflow-y-auto p-2 mb-4"
                    style={{
                      borderColor: "var(--color-v-2)",
                      backgroundColor: "var(--color-bg)",
                      maxHeight: "200px",
                    }}
                  >
                    {editedGroup.devices.map((device, deviceIndex) => (
                      <div key={deviceIndex} className="flex items-center gap-2 mb-1">
                        <input
                          type="text"
                          value={device}
                          onChange={(e) => {
                            const newDevices = [...editedGroup.devices];
                            newDevices[deviceIndex] = e.target.value;
                            setEditedGroup({ ...editedGroup, devices: newDevices });
                          }}
                          className="flex-1 p-1 border rounded"
                        />
                        <button
                          onClick={() => {
                            const newDevices = editedGroup.devices.filter(
                              (_, i) => i !== deviceIndex
                            );
                            setEditedGroup({ ...editedGroup, devices: newDevices });
                          }}
                          className="text-red-500 font-bold"
                        >
                          X
                        </button>
                      </div>
                    ))}

                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newDevice}
                        onChange={(e) => setNewDevice(e.target.value)}
                        placeholder="Nuevo dispositivo"
                        className="flex-1 p-1 border rounded"
                      />
                      <button
                        onClick={() => {
                          if (newDevice.trim()) {
                            setEditedGroup({
                              ...editedGroup,
                              devices: [...editedGroup.devices, newDevice.trim()],
                            });
                            setNewDevice("");
                          }
                        }}
                        className="bg-green-500 text-white px-2 rounded"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-around">
                    <button
                      onClick={handleSaveGroup}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-300 text-black rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h6
                    className="font-bold mb-2 text-center"
                    style={{ color: "var(--color-text)" }}
                  >
                    Nombre del grupo
                  </h6>
                  <h2
                    className="text-center mb-4 font-bold text-lg"
                    style={{ color: "var(--color-v-1)" }}
                  >
                    {group.name}
                  </h2>

                  <div
                    className="w-full flex-1 rounded-lg border overflow-y-auto p-2 mb-4"
                    style={{
                      borderColor: "var(--color-v-2)",
                      backgroundColor: "var(--color-bg)",
                      maxHeight: "200px",
                    }}
                  >
                    {group.devices.map((device, deviceIndex) => (
                      <div key={deviceIndex} className="text-[var(--color-text)] p-1">
                        {device}
                      </div>
                    ))}
                  </div>

                  <div className="w-full flex justify-around mt-auto">
                    <button
                      onClick={() => handleEditGroup(idx)}
                      className="flex flex-col items-center gap-1"
                      style={{ background: "transparent", border: "none" }}
                    >
                      <span
                        className="material-icons"
                        style={{ color: "var(--color-v-1)", fontSize: "2rem" }}
                      >
                        settings
                      </span>
                      <span style={{ color: "var(--color-text)" }}>Configurar</span>
                    </button>

                    <button
                      onClick={() => handleDeleteGroup(idx)}
                      className="flex flex-col items-center gap-1"
                      style={{ background: "transparent", border: "none" }}
                    >
                      <span
                        className="material-icons"
                        style={{ color: "red", fontSize: "2rem" }}
                      >
                        delete
                      </span>
                      <span style={{ color: "var(--color-text)" }}>Eliminar</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Botón para agregar nuevo grupo */}
          <div
            className="w-64 h-80 p-6 flex items-center justify-center rounded-xl transition-shadow hover:shadow-md"
            style={{
              border: "1px solid var(--color-v-2)",
              backgroundColor: "var(--color-bg)",
            }}
          >
            <div
              className="w-20 h-20 flex items-center justify-center border shadow-sm rounded-full cursor-pointer hover:shadow-md transition"
              onClick={handleAddGroup}
              style={{
                backgroundColor: "var(--color-v-4_1)",
                borderColor: "var(--color-v-4_1)",
                color: "white",
              }}
            >
              <span className="text-3xl">+</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 sm:px-0 max-w-4xl">
        <Footer_home />
      </div>

      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </>
  );
}
