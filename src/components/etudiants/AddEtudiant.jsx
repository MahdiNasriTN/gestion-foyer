import React, { useState } from 'react';

const AddEtudiant = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cinNumber: '',
    cinPlace: '',
    cinDate: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    currentSituation: '',
    phoneNumber: '',
    sendingAddress: '',
    centerName: '',
    specialization: '',
    cycle: '',
    fatherFirstName: '',
    fatherLastName: '',
    fatherPhone: '',
    fatherJob: '',
    fatherJobPlace: '',
    motherFirstName: '',
    motherLastName: '',
    motherPhone: '',
    motherJob: '',
    motherJobPlace: '',
    numberOfBrothers: '',
    numberOfSisters: '',
    hobby: '',
    trainingPeriodFrom: '',
    trainingPeriodTo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    onSave(formData);
  };

  const inputClass = "mt-1 block w-full px-4 py-3 rounded-lg border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none transition-all duration-200 ease-in-out";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const sectionHeaderClass = "text-xl font-bold text-blue-700 mb-6 pb-2 border-b-2 border-blue-200 flex items-center gap-2";
  const sectionClass = "bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8";

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 max-w-full mx-auto my-4 w-[98%]">
      <h2 className="text-4xl font-bold text-blue-800 mb-10 text-center">
        Ajouter un Étudiant
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className={sectionClass}>
          <h3 className={sectionHeaderClass}>
            <span className="bg-blue-100 text-blue-700 p-1.5 rounded-lg">👤</span>
            Informations Personnelles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="firstName" className={labelClass}>
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Prénom"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Nom"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className={labelClass}>
                Date de naissance
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="placeOfBirth" className={labelClass}>
                Lieu de naissance
              </label>
              <input
                type="text"
                id="placeOfBirth"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                placeholder="Lieu de naissance"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="nationality" className={labelClass}>
                Nationalité
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                placeholder="Nationalité"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="currentSituation" className={labelClass}>
                Situation actuelle
              </label>
              <select
                id="currentSituation"
                name="currentSituation"
                value={formData.currentSituation}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Sélectionnez une option</option>
                <option value="Célibataire">Célibataire</option>
                <option value="Marié">Marié</option>
              </select>
            </div>
          </div>
        </div>

        {/* CIN Information Section */}
        <div className={sectionClass}>
          <h3 className={sectionHeaderClass}>
            <span className="bg-purple-100 text-purple-700 p-1.5 rounded-lg">🆔</span>
            Informations CIN
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="cinNumber" className={labelClass}>
                Numéro CIN
              </label>
              <input
                type="text"
                id="cinNumber"
                name="cinNumber"
                value={formData.cinNumber}
                onChange={handleChange}
                placeholder="Numéro CIN"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cinPlace" className={labelClass}>
                Lieu de délivrance
              </label>
              <input
                type="text"
                id="cinPlace"
                name="cinPlace"
                value={formData.cinPlace}
                onChange={handleChange}
                placeholder="Lieu de délivrance"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cinDate" className={labelClass}>
                Date de délivrance
              </label>
              <input
                type="date"
                id="cinDate"
                name="cinDate"
                value={formData.cinDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className={sectionClass}>
          <h3 className={sectionHeaderClass}>
            <span className="bg-green-100 text-green-700 p-1.5 rounded-lg">📱</span>
            Informations de Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label htmlFor="phoneNumber" className={labelClass}>
                Numéro de téléphone
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Numéro de téléphone"
                required
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="sendingAddress" className={labelClass}>
                Adresse d'envoi
              </label>
              <input
                type="text"
                id="sendingAddress"
                name="sendingAddress"
                value={formData.sendingAddress}
                onChange={handleChange}
                placeholder="Adresse d'envoi"
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Educational Information Section */}
        <div className={sectionClass}>
          <h3 className={sectionHeaderClass}>
            <span className="bg-amber-100 text-amber-700 p-1.5 rounded-lg">🎓</span>
            Informations Éducatives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="centerName" className={labelClass}>
                Nom du centre
              </label>
              <input
                type="text"
                id="centerName"
                name="centerName"
                value={formData.centerName}
                onChange={handleChange}
                placeholder="Nom du centre"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="specialization" className={labelClass}>
                Spécialisation
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Spécialisation"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cycle" className={labelClass}>
                Cycle
              </label>
              <select
                id="cycle"
                name="cycle"
                value={formData.cycle}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Sélectionnez un cycle</option>
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
                <option value="Doctorat">Doctorat</option>
              </select>
            </div>
            <div>
              <label htmlFor="trainingPeriodFrom" className={labelClass}>
                Début de formation
              </label>
              <input
                type="date"
                id="trainingPeriodFrom"
                name="trainingPeriodFrom"
                value={formData.trainingPeriodFrom}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="trainingPeriodTo" className={labelClass}>
                Fin de formation
              </label>
              <input
                type="date"
                id="trainingPeriodTo"
                name="trainingPeriodTo"
                value={formData.trainingPeriodTo}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Father Information Section */}
        <div className={sectionClass}>
          <h3 className={sectionHeaderClass}>
            <span className="bg-red-100 text-red-700 p-1.5 rounded-lg">👨</span>
            Informations du Père
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="fatherFirstName" className={labelClass}>
                Prénom du père
              </label>
              <input
                type="text"
                id="fatherFirstName"
                name="fatherFirstName"
                value={formData.fatherFirstName}
                onChange={handleChange}
                placeholder="Prénom du père"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="fatherLastName" className={labelClass}>
                Nom du père
              </label>
              <input
                type="text"
                id="fatherLastName"
                name="fatherLastName"
                value={formData.fatherLastName}
                onChange={handleChange}
                placeholder="Nom du père"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="fatherPhone" className={labelClass}>
                Téléphone du père
              </label>
              <input
                type="text"
                id="fatherPhone"
                name="fatherPhone"
                value={formData.fatherPhone}
                onChange={handleChange}
                placeholder="Téléphone du père"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="fatherJob" className={labelClass}>
                Profession du père
              </label>
              <input
                type="text"
                id="fatherJob"
                name="fatherJob"
                value={formData.fatherJob}
                onChange={handleChange}
                placeholder="Profession du père"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="fatherJobPlace" className={labelClass}>
                Lieu de travail du père
              </label>
              <input
                type="text"
                id="fatherJobPlace"
                name="fatherJobPlace"
                value={formData.fatherJobPlace}
                onChange={handleChange}
                placeholder="Lieu de travail du père"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Mother Information Section */}
        <div className={sectionClass}>
          <h3 className={sectionHeaderClass}>
            <span className="bg-pink-100 text-pink-700 p-1.5 rounded-lg">👩</span>
            Informations de la Mère
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="motherFirstName" className={labelClass}>
                Prénom de la mère
              </label>
              <input
                type="text"
                id="motherFirstName"
                name="motherFirstName"
                value={formData.motherFirstName}
                onChange={handleChange}
                placeholder="Prénom de la mère"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="motherLastName" className={labelClass}>
                Nom de la mère
              </label>
              <input
                type="text"
                id="motherLastName"
                name="motherLastName"
                value={formData.motherLastName}
                onChange={handleChange}
                placeholder="Nom de la mère"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="motherPhone" className={labelClass}>
                Téléphone de la mère
              </label>
              <input
                type="text"
                id="motherPhone"
                name="motherPhone"
                value={formData.motherPhone}
                onChange={handleChange}
                placeholder="Téléphone de la mère"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="motherJob" className={labelClass}>
                Profession de la mère
              </label>
              <input
                type="text"
                id="motherJob"
                name="motherJob"
                value={formData.motherJob}
                onChange={handleChange}
                placeholder="Profession de la mère"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="motherJobPlace" className={labelClass}>
                Lieu de travail de la mère
              </label>
              <input
                type="text"
                id="motherJobPlace"
                name="motherJobPlace"
                value={formData.motherJobPlace}
                onChange={handleChange}
                placeholder="Lieu de travail de la mère"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className={sectionClass}>
          <h3 className={sectionHeaderClass}>
            <span className="bg-cyan-100 text-cyan-700 p-1.5 rounded-lg">➕</span>
            Informations Supplémentaires
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="numberOfBrothers" className={labelClass}>
                Nombre de frères
              </label>
              <input
                type="number"
                id="numberOfBrothers"
                name="numberOfBrothers"
                value={formData.numberOfBrothers}
                onChange={handleChange}
                min="0"
                placeholder="Nombre de frères"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="numberOfSisters" className={labelClass}>
                Nombre de sœurs
              </label>
              <input
                type="number"
                id="numberOfSisters"
                name="numberOfSisters"
                value={formData.numberOfSisters}
                onChange={handleChange}
                min="0"
                placeholder="Nombre de sœurs"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="hobby" className={labelClass}>
                Loisirs
              </label>
              <input
                type="text"
                id="hobby"
                name="hobby"
                value={formData.hobby}
                onChange={handleChange}
                placeholder="Loisirs"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Annuler
          </button>
          
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEtudiant;