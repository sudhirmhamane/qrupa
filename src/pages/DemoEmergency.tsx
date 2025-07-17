import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Phone, AlertTriangle, Pill, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DemoEmergency = () => {
  const navigate = useNavigate();

  // Demo medical profile data
  const demoProfile = {
    emergency_contact_name: "Jane Doe",
    emergency_contact_phone: "+1 (555) 123-4567",
    emergency_contact_relation: "Spouse",
    blood_group: "A+",
    allergies: "Penicillin, Shellfish, Bee stings",
    chronic_conditions: "Type 2 Diabetes, Hypertension",
    medications: "Metformin 500mg twice daily, Lisinopril 10mg once daily, Aspirin 81mg daily",
    additional_notes: "Wears contact lenses. Has medical alert bracelet. Prefers right arm for blood pressure checks due to previous surgery on left arm."
  };

  const callEmergencyContact = () => {
    window.location.href = `tel:${demoProfile.emergency_contact_phone}`;
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-medical-primary text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <Button
            onClick={handleGoBack}
            variant="ghost"
            size="sm"
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Homepage
          </Button>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Heart className="w-10 h-10" />
              <h1 className="text-3xl font-bold">Demo: Emergency Medical Information</h1>
            </div>
            <p className="text-medical-light text-lg">
              This is how your QR code will display critical health information
            </p>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-warning text-warning-foreground py-3">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-semibold">🎯 DEMO MODE - This is sample data to show how MedLink works</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Emergency Contact */}
          <Card className="border-medical-primary border-2">
            <CardHeader className="bg-medical-primary/5">
              <CardTitle className="flex items-center gap-2 text-medical-primary">
                <Phone className="w-5 h-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-medical-dark">
                    {demoProfile.emergency_contact_name}
                  </p>
                  <p className="text-muted-foreground">
                    {demoProfile.emergency_contact_relation}
                  </p>
                  <p className="text-xl font-semibold text-medical-primary mt-2">
                    {demoProfile.emergency_contact_phone}
                  </p>
                </div>
                <button
                  onClick={callEmergencyContact}
                  className="bg-medical-primary text-white px-6 py-3 rounded-lg hover:bg-medical-secondary transition-colors text-lg font-semibold"
                >
                  CALL NOW
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Critical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-medical-accent" />
                  Critical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
                  <Badge variant="destructive" className="text-lg px-3 py-1">
                    {demoProfile.blood_group}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Allergies</p>
                  <div className="bg-destructive/10 border border-destructive/20 rounded p-3 mt-1">
                    <p className="text-destructive font-medium">⚠️ ALLERGIC TO:</p>
                    <p className="whitespace-pre-wrap">{demoProfile.allergies}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Medical Conditions</p>
                  <p className="bg-muted p-3 rounded mt-1 whitespace-pre-wrap">
                    {demoProfile.chronic_conditions}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Medications & Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Medications & Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Medications</p>
                  <p className="bg-muted p-3 rounded mt-1 whitespace-pre-wrap">
                    {demoProfile.medications}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
                  <p className="bg-muted p-3 rounded mt-1 whitespace-pre-wrap">
                    {demoProfile.additional_notes}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <Card className="border-medical-accent">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 text-medical-accent">
                <FileText className="w-5 h-5 mt-0.5" />
                <div>
                  <p className="font-semibold">For Emergency Responders:</p>
                  <p className="text-sm">
                    This information is provided by the patient for emergency situations. 
                    Please contact the listed emergency contact for additional information 
                    and verify any critical details when possible.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Create Your Own Profile?</h3>
              <p className="mb-6 opacity-90">
                This demo shows how MedLink can save lives by providing instant access to critical medical information.
              </p>
              <Button 
                onClick={() => navigate('/auth')}
                variant="secondary"
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
              >
                Get Started Now - It's Free!
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DemoEmergency;