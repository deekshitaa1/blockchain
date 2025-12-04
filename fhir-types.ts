// A simplified set of FHIR-inspired types for demonstration purposes.
// Not a complete FHIR implementation.

export interface FHIR_Identifier {
  system?: string;
  value?: string;
}

export interface FHIR_Reference {
  reference?: string; // e.g., "Patient/patient_01"
  display?: string;
}

export interface FHIR_CodeableConcept {
  text: string; // e.g., "Viral Fever"
}

// Base for all FHIR resources
export interface FHIR_Resource {
  resourceType: string;
  id?: string;
}

// Represents a clinical observation
export interface FHIR_Observation extends FHIR_Resource {
  resourceType: 'Observation';
  status: 'final' | 'preliminary' | 'corrected';
  code: FHIR_CodeableConcept;
  subject: FHIR_Reference;
  valueString?: string;
}

// Represents a prescription or order for medication
export interface FHIR_MedicationRequest extends FHIR_Resource {
  resourceType: 'MedicationRequest';
  status: 'active' | 'on-hold' | 'cancelled';
  intent: 'proposal' | 'plan' | 'order';
  medicationCodeableConcept: FHIR_CodeableConcept;
  subject: FHIR_Reference;
}
