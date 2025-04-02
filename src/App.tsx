import React, { useState, useEffect } from 'react';
import { Clock, Bell, PlusCircle, User, Pill, X, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Patient, Medication, MedicationAlarm } from './types';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'patients' | 'medications' | 'alarms'>('patients');
  const [patients, setPatients] = useState<Patient[]>([
    { id: '1', name: 'Maria Silva', age: 75, room: '101' },
    { id: '2', name: 'João Santos', age: 82, room: '102' }
  ]);
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Losartana',
      dosage: '50mg',
      frequency: 'Diário',
      times: ['08:00', '20:00'],
      instructions: 'Tomar com água',
      patientId: '1'
    }
  ]);

  // Modal states
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'patient' | 'medication', id: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({
    name: '',
    age: 0,
    room: ''
  });

  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
    name: '',
    dosage: '',
    frequency: '',
    times: [''],
    instructions: '',
    patientId: ''
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkMedicationAlarms();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const checkMedicationAlarms = () => {
    const currentTimeStr = format(currentTime, 'HH:mm');
    medications.forEach(medication => {
      if (medication.times.includes(currentTimeStr)) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Hora do Medicamento!', {
            body: `${medication.name} - ${medication.dosage} para ${patients.find(p => p.id === medication.patientId)?.name}`,
          });
        }
      }
    });
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      setPatients(patients.map(p => p.id === editingId ? { ...p, ...newPatient } : p));
      setIsEditing(false);
      setEditingId(null);
    } else {
      const id = crypto.randomUUID();
      setPatients([...patients, { ...newPatient, id }]);
    }
    setNewPatient({ name: '', age: 0, room: '' });
    setShowPatientModal(false);
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && editingId) {
      setMedications(medications.map(m => m.id === editingId ? { ...m, ...newMedication, id: editingId } : m));
      setIsEditing(false);
      setEditingId(null);
    } else {
      const id = crypto.randomUUID();
      setMedications([...medications, { ...newMedication, id }]);
    }
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      times: [''],
      instructions: '',
      patientId: ''
    });
    setShowMedicationModal(false);
  };

  const handleDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'patient') {
      setPatients(patients.filter(p => p.id !== itemToDelete.id));
      setMedications(medications.filter(m => m.patientId !== itemToDelete.id));
    } else {
      setMedications(medications.filter(m => m.id !== itemToDelete.id));
    }

    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  const handleDeleteClick = (type: 'patient' | 'medication', id: string) => {
    setItemToDelete({ type, id });
    setShowDeleteConfirmation(true);
  };

  const handleEditClick = (type: 'patient' | 'medication', id: string) => {
    setIsEditing(true);
    setEditingId(id);
    
    if (type === 'patient') {
      const patient = patients.find(p => p.id === id);
      if (patient) {
        setNewPatient({
          name: patient.name,
          age: patient.age,
          room: patient.room
        });
        setShowPatientModal(true);
      }
    } else {
      const medication = medications.find(m => m.id === id);
      if (medication) {
        setNewMedication({
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          times: [...medication.times],
          instructions: medication.instructions,
          patientId: medication.patientId
        });
        setShowMedicationModal(true);
      }
    }
  };

  const handleAddMedicationTime = () => {
    setNewMedication({
      ...newMedication,
      times: [...newMedication.times, '']
    });
  };

  const handleRemoveMedicationTime = (index: number) => {
    setNewMedication({
      ...newMedication,
      times: newMedication.times.filter((_, i) => i !== index)
    });
  };

  const handleMedicationTimeChange = (index: number, value: string) => {
    const newTimes = [...newMedication.times];
    newTimes[index] = value;
    setNewMedication({
      ...newMedication,
      times: newTimes
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Pill className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Sistema de Medicamentos</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6" />
            <span className="text-xl">
              {format(currentTime, "HH:mm:ss", { locale: ptBR })}
            </span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto">
          <div className="flex space-x-4 p-4">
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'patients' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('patients')}
            >
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Pacientes</span>
              </div>
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'medications' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('medications')}
            >
              <div className="flex items-center space-x-2">
                <Pill className="h-5 w-5" />
                <span>Medicamentos</span>
              </div>
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'alarms' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('alarms')}
            >
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Alarmes</span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {activeTab === 'patients' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Pacientes</h2>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  setNewPatient({ name: '', age: 0, room: '' });
                  setShowPatientModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Adicionar Paciente</span>
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {patients.map(patient => {
                const patientMedications = medications.filter(m => m.patientId === patient.id);
                return (
                  <div key={patient.id} className="bg-white p-6 rounded-lg shadow-md relative">
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        onClick={() => handleEditClick('patient', patient.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick('patient', patient.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <h3 className="text-xl font-semibold">{patient.name}</h3>
                    <p className="text-gray-600">Idade: {patient.age} anos</p>
                    <p className="text-gray-600">Quarto: {patient.room}</p>
                    
                    {patientMedications.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Medicamentos:</h4>
                        <div className="space-y-2">
                          {patientMedications.map(med => (
                            <div key={med.id} className="bg-gray-50 p-3 rounded-md">
                              <p className="font-medium">{med.name} - {med.dosage}</p>
                              <p className="text-sm text-gray-600">Horários: {med.times.join(', ')}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Medicamentos</h2>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  setNewMedication({
                    name: '',
                    dosage: '',
                    frequency: '',
                    times: [''],
                    instructions: '',
                    patientId: ''
                  });
                  setShowMedicationModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Adicionar Medicamento</span>
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {medications.map(medication => (
                <div key={medication.id} className="bg-white p-6 rounded-lg shadow-md relative">
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={() => handleEditClick('medication', medication.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick('medication', medication.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <h3 className="text-xl font-semibold">{medication.name}</h3>
                  <p className="text-gray-600">Dosagem: {medication.dosage}</p>
                  <p className="text-gray-600">Frequência: {medication.frequency}</p>
                  <p className="text-gray-600">Horários: {medication.times.join(', ')}</p>
                  <p className="text-gray-600">Instruções: {medication.instructions}</p>
                  <p className="text-gray-600">
                    Paciente: {patients.find(p => p.id === medication.patientId)?.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'alarms' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Alarmes Ativos</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medicamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medications.flatMap(med => 
                    med.times.map((time, idx) => (
                      <tr key={`${med.id}-${idx}`}>
                        <td className="px-6 py-4 whitespace-nowrap">{time}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {med.name} - {med.dosage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {patients.find(p => p.id === med.patientId)?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Ativo
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Patient Modal */}
      {showPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {isEditing ? 'Editar Paciente' : 'Adicionar Paciente'}
              </h3>
              <button 
                onClick={() => setShowPatientModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  required
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Idade</label>
                <input
                  type="number"
                  required
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({ ...newPatient, age: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quarto</label>
                <input
                  type="text"
                  required
                  value={newPatient.room}
                  onChange={(e) => setNewPatient({ ...newPatient, room: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {isEditing ? 'Salvar Alterações' : 'Adicionar Paciente'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {showMedicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {isEditing ? 'Editar Medicamento' : 'Adicionar Medicamento'}
              </h3>
              <button 
                onClick={() => setShowMedicationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddMedication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome do Medicamento</label>
                <input
                  type="text"
                  required
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dosagem</label>
                <input
                  type="text"
                  required
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Frequência</label>
                <input
                  type="text"
                  required
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Paciente</label>
                <select
                  required
                  value={newMedication.patientId}
                  onChange={(e) => setNewMedication({ ...newMedication, patientId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Selecione um paciente</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - Quarto {patient.room}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horários</label>
                {newMedication.times.map((time, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="time"
                      required
                      value={time}
                      onChange={(e) => handleMedicationTimeChange(index, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicationTime(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddMedicationTime}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Adicionar horário
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instruções</label>
                <textarea
                  required
                  value={newMedication.instructions}
                  onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {isEditing ? 'Salvar Alterações' : 'Adicionar Medicamento'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-6">
              {itemToDelete?.type === 'patient' 
                ? "Tem certeza que deseja excluir este paciente? Todos os medicamentos associados também serão excluídos."
                : "Tem certeza que deseja excluir este medicamento?"}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;