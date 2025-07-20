import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { Input, Button, Text, ButtonGroup, CheckBox } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { COLORS, PATIENT_DEMOGRAPHICS, MEDICAL_CATEGORIES, AREA_CODES } from '../constants';
import DateTimePicker from '@react-native-community/datetimepicker';

const GENDER_OPTIONS = ['male', 'female'];

const defaultValues = {
  name: '',
  age: '',
  gender: '',
  date_of_birth: '',
  marital_status: '',
  education_level: '',
  occupation: '',
  blood_group: '',
  phone_number: '',
  address: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relation: '',
  medical_condition: '',
  allergies: '',
  current_medications: '',
  chronic_conditions: '',
  family_history: '',
  lifestyle_factors: '',
  area_code: '',
};

const PatientForm = ({ initialValues = defaultValues, onSubmit, submitLabel = 'Save Patient', onCancel }) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [selectedGender, setSelectedGender] = useState(
    PATIENT_DEMOGRAPHICS.gender.indexOf(initialValues.gender) >= 0 ? PATIENT_DEMOGRAPHICS.gender.indexOf(initialValues.gender) : -1
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  // Remove showMore logic
  const [showDatePicker, setShowDatePicker] = useState(false);

  const steps = [
    { title: 'Basic Info', icon: 'person' },
    { title: 'Contact', icon: 'phone' },
    { title: 'Medical', icon: 'medical-services' },
    { title: 'Review', icon: 'check-circle' }
  ];

  const validate = () => {
    let errs = {};
    if (!form.name) errs.name = 'Patient name is required';
    if (!form.age) errs.age = 'Age is required';
    if (!form.gender) errs.gender = 'Gender is required';
    if (!form.medical_condition) errs.medical_condition = 'Medical condition is required';
    if (!form.area_code) errs.area_code = 'Area code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const handleGenderChange = (index) => {
    setSelectedGender(index);
    setForm({ ...form, gender: PATIENT_DEMOGRAPHICS.gender[index] });
    setErrors({ ...errors, gender: undefined });
  };

  const handleSubmit = async () => {
    setTriedSubmit(true);
    if (validate()) {
      setLoading(true);
      try {
        await onSubmit(form);
        Alert.alert('Success', 'Patient information saved successfully!');
        setTriedSubmit(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to save patient: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            index <= currentStep ? styles.stepActive : styles.stepInactive
          ]}>
            <Text style={[
              styles.stepNumber,
              index <= currentStep ? styles.stepNumberActive : styles.stepNumberInactive
            ]}>
              {index + 1}
            </Text>
          </View>
          <Text style={[
            styles.stepTitle,
            index <= currentStep ? styles.stepTitleActive : styles.stepTitleInactive
          ]}>
            {step.title}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderBasicInfo = () => (
    <View style={styles.stepContainer}>
        <Input
        label="Name"
          value={form.name}
          onChangeText={v => handleChange('name', v)}
        errorMessage={triedSubmit && !form.name ? 'Required' : undefined}
          containerStyle={styles.input}
        placeholder="Full name"
        />
        <Input
        label="Age"
          value={String(form.age)}
          keyboardType="numeric"
          onChangeText={v => handleChange('age', v.replace(/[^0-9]/g, ''))}
        errorMessage={triedSubmit && !form.age ? 'Required' : undefined}
          containerStyle={styles.input}
        placeholder="Age"
        />
      <Text style={styles.label}>Gender</Text>
        <ButtonGroup
          onPress={handleGenderChange}
          selectedIndex={selectedGender}
          buttons={PATIENT_DEMOGRAPHICS.gender.map(g => g.charAt(0).toUpperCase() + g.slice(1))}
          containerStyle={styles.genderGroup}
          selectedButtonStyle={styles.genderSelected}
        textStyle={styles.genderText}
        />
      {triedSubmit && !form.gender ? (
        <Text style={styles.requiredMark}>Required</Text>
      ) : null}
      <Input
        label="Medical Condition"
        value={form.medical_condition}
        onChangeText={v => handleChange('medical_condition', v)}
        errorMessage={triedSubmit && !form.medical_condition ? 'Required' : undefined}
        containerStyle={styles.input}
        placeholder="e.g. Diabetes"
      />
      <Text style={styles.label}>Area Code</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.area_code}
          onValueChange={v => handleChange('area_code', v)}
          style={styles.picker}
          mode="dropdown"
        >
          <Picker.Item label="Select Area" value="" color={COLORS.muted} />
          {Object.entries(AREA_CODES).map(([code, name]) => (
            <Picker.Item key={code} label={name} value={code} color={COLORS.text} />
          ))}
        </Picker>
      </View>
      {triedSubmit && !form.area_code ? (
        <Text style={styles.requiredMark}>Required</Text>
      ) : null}
      {/* Remove showMore and renderMoreFields */}
    </View>
  );

  const renderContactInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepHeader}>Contact Information</Text>
      
        <Input
          label="Phone Number"
          value={form.phone_number}
          onChangeText={v => handleChange('phone_number', v)}
          keyboardType="phone-pad"
          containerStyle={styles.input}
        leftIcon={{ name: 'phone', color: COLORS.primary }}
        placeholder="Enter phone number"
        />
      
        <Input
          label="Address"
          value={form.address}
          onChangeText={v => handleChange('address', v)}
          multiline
        numberOfLines={3}
          containerStyle={styles.input}
        leftIcon={{ name: 'location-on', color: COLORS.primary }}
        placeholder="Enter full address"
        />
        
        <Text style={styles.sectionTitle}>Emergency Contact</Text>
      
        <Input
          label="Emergency Contact Name"
          value={form.emergency_contact_name}
          onChangeText={v => handleChange('emergency_contact_name', v)}
          containerStyle={styles.input}
        leftIcon={{ name: 'person-add', color: COLORS.primary }}
        placeholder="Emergency contact name"
        />
      
      <View style={styles.row}>
        <Input
          label="Emergency Phone"
          value={form.emergency_contact_phone}
          onChangeText={v => handleChange('emergency_contact_phone', v)}
          keyboardType="phone-pad"
          containerStyle={[styles.input, { flex: 1, marginRight: 8 }]}
          leftIcon={{ name: 'phone', color: COLORS.primary }}
          placeholder="Emergency phone"
        />
        <Input
          label="Relationship"
          value={form.emergency_contact_relation}
          onChangeText={v => handleChange('emergency_contact_relation', v)}
          containerStyle={[styles.input, { flex: 1, marginLeft: 8 }]}
          leftIcon={{ name: 'family-restroom', color: COLORS.primary }}
          placeholder="Spouse, Parent, etc."
        />
      </View>

        <Text style={styles.label}>Area Code *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.area_code}
            onValueChange={v => handleChange('area_code', v)}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="Select Area" value="" color={COLORS.muted} />
            {Object.entries(AREA_CODES).map(([code, name]) => (
              <Picker.Item key={code} label={name} value={code} color={COLORS.text} />
            ))}
          </Picker>
        </View>
        {triedSubmit && !form.area_code ? (
          <Text style={styles.requiredMark}>Required</Text>
        ) : null}
        {errors.area_code ? <Text style={styles.error}>{errors.area_code}</Text> : null}
    </View>
  );

  const renderMedicalInfo = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepHeader}>Medical Information</Text>
      
      <Input
        label="Primary Medical Condition *"
          value={form.medical_condition}
          onChangeText={v => handleChange('medical_condition', v)}
          errorMessage={errors.medical_condition}
          containerStyle={styles.input}
        leftIcon={{ name: 'medical-services', color: COLORS.primary }}
        placeholder="Main medical condition"
        />
      {triedSubmit && !form.medical_condition ? (
        <Text style={styles.requiredMark}>Required</Text>
      ) : null}
      
        <Input
          label="Allergies"
          value={form.allergies}
          onChangeText={v => handleChange('allergies', v)}
          containerStyle={styles.input}
        leftIcon={{ name: 'warning', color: COLORS.warning }}
        placeholder="e.g., Penicillin, Peanuts, Latex"
        />
      
        <Input
          label="Current Medications"
          value={form.current_medications}
          onChangeText={v => handleChange('current_medications', v)}
          containerStyle={styles.input}
        leftIcon={{ name: 'medication', color: COLORS.primary }}
        placeholder="List current medications"
        />
      
        <Input
          label="Chronic Conditions"
          value={form.chronic_conditions}
          onChangeText={v => handleChange('chronic_conditions', v)}
          containerStyle={styles.input}
        leftIcon={{ name: 'healing', color: COLORS.primary }}
          placeholder="e.g., Diabetes, Hypertension"
        />
      
        <Input
          label="Family History"
          value={form.family_history}
          onChangeText={v => handleChange('family_history', v)}
          containerStyle={styles.input}
        leftIcon={{ name: 'family-restroom', color: COLORS.primary }}
        placeholder="Family medical history"
        />
      
        <Input
          label="Lifestyle Factors"
          value={form.lifestyle_factors}
          onChangeText={v => handleChange('lifestyle_factors', v)}
          containerStyle={styles.input}
        leftIcon={{ name: 'fitness-center', color: COLORS.primary }}
          placeholder="e.g., Smoking, Exercise habits"
        />
    </View>
  );

  const renderReview = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepHeader}>Review Patient Information</Text>
      
      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Basic Information</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Name:</Text>
          <Text style={styles.reviewValue}>{form.name || 'Not provided'}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Age:</Text>
          <Text style={styles.reviewValue}>{form.age || 'Not provided'}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Gender:</Text>
          <Text style={styles.reviewValue}>{form.gender || 'Not provided'}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Medical Condition:</Text>
          <Text style={styles.reviewValue}>{form.medical_condition || 'Not provided'}</Text>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Contact Information</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Phone:</Text>
          <Text style={styles.reviewValue}>{form.phone_number || 'Not provided'}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Area:</Text>
          <Text style={styles.reviewValue}>{AREA_CODES[form.area_code] || 'Not selected'}</Text>
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Medical Information</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Allergies:</Text>
          <Text style={styles.reviewValue}>{form.allergies || 'None reported'}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Current Medications:</Text>
          <Text style={styles.reviewValue}>{form.current_medications || 'None reported'}</Text>
        </View>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderBasicInfo();
      case 1: return renderContactInfo();
      case 2: return renderMedicalInfo();
      case 3: return renderReview();
      default: return renderBasicInfo();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.mobileFormContainer}>
        <View style={styles.mobileFormHeader}>
          <Button
            title="Cancel"
            type="clear"
            onPress={onCancel || Keyboard.dismiss}
            titleStyle={styles.cancelButtonTextMobile}
            containerStyle={styles.cancelButtonContainerMobile}
          />
        </View>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentMobile}>
          <Text style={styles.mobileLabel}>Name <Text style={styles.asterisk}>*</Text></Text>
          <TextInput
            style={styles.mobileInput}
            value={form.name}
            onChangeText={v => handleChange('name', v)}
            placeholder="Full name"
            placeholderTextColor={COLORS.muted}
          />
          {triedSubmit && !form.name ? <Text style={styles.requiredMark}>Required</Text> : null}

          <Text style={styles.mobileLabel}>Age <Text style={styles.asterisk}>*</Text></Text>
          <TextInput
            style={styles.mobileInput}
            value={String(form.age)}
            keyboardType="numeric"
            onChangeText={v => handleChange('age', v.replace(/[^0-9]/g, ''))}
            placeholder="Age"
            placeholderTextColor={COLORS.muted}
          />
          {triedSubmit && !form.age ? <Text style={styles.requiredMark}>Required</Text> : null}

          <Text style={styles.mobileLabel}>Medical Condition <Text style={styles.asterisk}>*</Text></Text>
          <TextInput
            style={styles.mobileInput}
            value={form.medical_condition}
            onChangeText={v => handleChange('medical_condition', v)}
            placeholder="e.g. Diabetes"
            placeholderTextColor={COLORS.muted}
          />
          {triedSubmit && !form.medical_condition ? <Text style={styles.requiredMark}>Required</Text> : null}

          <Text style={styles.mobileLabel}>Gender <Text style={styles.asterisk}>*</Text></Text>
          <View style={styles.genderRowMobile}>
            {GENDER_OPTIONS.map((g, idx) => (
              <TouchableOpacity
                key={g}
                style={[styles.genderBtnMobile, form.gender === g && styles.genderBtnSelectedMobile]}
                onPress={() => handleChange('gender', g)}
              >
                <Text style={form.gender === g ? styles.genderBtnTextSelectedMobile : styles.genderBtnTextMobile}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {triedSubmit && !form.gender ? <Text style={styles.requiredMark}>Required</Text> : null}

          <Text style={styles.mobileLabel}>Area Code <Text style={styles.asterisk}>*</Text></Text>
          <View style={styles.pickerContainerMobile}>
          <Picker
            selectedValue={form.area_code}
            onValueChange={v => handleChange('area_code', v)}
              style={styles.pickerMobile}
              mode="dropdown"
          >
              <Picker.Item label="Select Area" value="" color={COLORS.muted} />
            {Object.entries(AREA_CODES).map(([code, name]) => (
                <Picker.Item key={code} label={name} value={code} color={COLORS.text} />
            ))}
          </Picker>
        </View>
          {triedSubmit && !form.area_code ? <Text style={styles.requiredMark}>Required</Text> : null}

          {/* Optional Fields */}
          <Text style={styles.mobileLabel}>Date of Birth</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View pointerEvents="none">
              <TextInput
                style={styles.mobileInput}
                value={form.date_of_birth}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={COLORS.muted}
                editable={false}
              />
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={form.date_of_birth ? new Date(form.date_of_birth) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  handleChange('date_of_birth', selectedDate.toISOString().slice(0, 10));
                }
              }}
              maximumDate={new Date()}
            />
          )}
          <Text style={styles.mobileLabel}>Phone Number</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.phone_number}
            onChangeText={v => handleChange('phone_number', v)}
            keyboardType="phone-pad"
            placeholder="Phone number"
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.mobileLabel}>Address</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.address}
            onChangeText={v => handleChange('address', v)}
            placeholder="Address"
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.mobileLabel}>Blood Group</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.blood_group}
            onChangeText={v => handleChange('blood_group', v)}
            placeholder="A+, O-, etc."
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.mobileLabel}>Allergies</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.allergies}
            onChangeText={v => handleChange('allergies', v)}
            placeholder="Allergies"
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.mobileLabel}>Current Medications</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.current_medications}
            onChangeText={v => handleChange('current_medications', v)}
            placeholder="Medications"
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.mobileLabel}>Chronic Conditions</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.chronic_conditions}
            onChangeText={v => handleChange('chronic_conditions', v)}
            placeholder="Chronic conditions"
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.mobileLabel}>Family History</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.family_history}
            onChangeText={v => handleChange('family_history', v)}
            placeholder="Family history"
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.mobileLabel}>Emergency Contact Name</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.emergency_contact_name}
            onChangeText={v => handleChange('emergency_contact_name', v)}
            placeholder="Contact name"
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.mobileLabel}>Emergency Contact Phone</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.emergency_contact_phone}
            onChangeText={v => handleChange('emergency_contact_phone', v)}
            keyboardType="phone-pad"
            placeholder="Contact phone"
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.mobileLabel}>Emergency Contact Relation</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.emergency_contact_relation}
            onChangeText={v => handleChange('emergency_contact_relation', v)}
            placeholder="Relation"
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.mobileLabel}>Marital Status</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.marital_status}
            onChangeText={v => handleChange('marital_status', v)}
            placeholder="Marital status"
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.mobileLabel}>Education Level</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.education_level}
            onChangeText={v => handleChange('education_level', v)}
            placeholder="Education"
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.mobileLabel}>Occupation</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.occupation}
            onChangeText={v => handleChange('occupation', v)}
            placeholder="Occupation"
            placeholderTextColor={COLORS.muted}
          />
          <Text style={styles.mobileLabel}>Lifestyle Factors</Text>
          <TextInput
            style={styles.mobileInput}
            value={form.lifestyle_factors}
            onChangeText={v => handleChange('lifestyle_factors', v)}
            placeholder="Lifestyle"
            placeholderTextColor={COLORS.muted}
          />
        </ScrollView>
        <View style={styles.stickySaveButtonContainer}>
        <Button
            title={loading ? 'Saving...' : submitLabel}
          onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            buttonStyle={styles.stickySaveButton}
            titleStyle={styles.stickySaveButtonText}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 4,
    margin: 16,
    maxHeight: '90%',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepActive: {
    backgroundColor: COLORS.primary,
  },
  stepInactive: {
    backgroundColor: COLORS.muted,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: COLORS.white,
  },
  stepNumberInactive: {
    color: COLORS.text,
  },
  stepTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  stepTitleActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  stepTitleInactive: {
    color: COLORS.muted,
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 10,
    marginBottom: 8,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: 16,
  },
  genderGroup: {
    marginBottom: 16,
    borderRadius: 12,
    height: 48,
    backgroundColor: COLORS.background,
  },
  genderSelected: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  genderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: COLORS.background,
  },
  picker: {
    height: 50,
  },
  error: {
    color: COLORS.danger,
    marginLeft: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: COLORS.background,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  buttonSpacing: {
    flex: 1,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: COLORS.muted,
    borderRadius: 12,
    paddingVertical: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  submitButton: {
    backgroundColor: COLORS.success,
    borderRadius: 12,
    paddingVertical: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewSection: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewLabel: {
    fontSize: 14,
    color: COLORS.muted,
    fontWeight: 'bold',
  },
  reviewValue: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    textAlign: 'right',
  },
  requiredMark: {
    color: COLORS.danger,
    fontSize: 13,
    marginLeft: 10,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  showMoreBtn: {
    color: COLORS.primary,
    fontSize: 14,
    marginTop: 10,
  },
  containerMinimal: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 2,
    margin: 8,
    maxHeight: '90%',
  },
  buttonContainerMinimal: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  submitButtonMinimal: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    flex: 1,
    marginRight: 8,
  },
  submitButtonTextMinimal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonTextMinimal: {
    color: COLORS.muted,
    fontSize: 16,
  },
  cardFormContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    elevation: 3,
    margin: 12,
    padding: 8,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
    borderRadius: 1,
  },
  asterisk: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  buttonContainerCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  saveButtonCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    flex: 1,
    marginRight: 8,
  },
  saveButtonTextCard: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonTextCard: {
    color: COLORS.muted,
    fontSize: 16,
  },
  mobileFormContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    margin: 0,
    padding: 0,
    maxHeight: '100%',
  },
  mobileFormHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cancelButtonTextMobile: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonContainerMobile: {
    alignSelf: 'flex-start',
    marginLeft: 0,
    marginRight: 'auto',
    padding: 0,
  },
  scrollContentMobile: {
    padding: 16,
    paddingBottom: 100,
  },
  mobileLabel: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 12,
  },
  mobileInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 2,
  },
  genderRowMobile: {
    flexDirection: 'row',
    marginBottom: 8,
    marginTop: 2,
  },
  genderBtnMobile: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },
  genderBtnSelectedMobile: {
    backgroundColor: COLORS.primary,
  },
  genderBtnTextMobile: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 15,
  },
  genderBtnTextSelectedMobile: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },
  pickerContainerMobile: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: 2,
    marginTop: 2,
  },
  pickerMobile: {
    height: 48,
    color: COLORS.text,
  },
  stickySaveButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  stickySaveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 16,
  },
  stickySaveButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default PatientForm;
