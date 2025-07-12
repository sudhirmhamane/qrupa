import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Phone, AlertTriangle, Pill, FileText } from 'lucide-react';

interface MedicalProfile {
  id: string;
  blood_group: string | null;
  allergies: string | null;
  chronic_conditions: string | null;
  medications: string | null;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string | null;
  additional_notes: string | null;
}

const EmergencyView = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [medicalProfile, setMedicalProfile] = useState<MedicalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchMedicalProfile();
  }, [profileId]);

  const fetchMedicalProfile = async () => {
    try {
      if (!profileId) {
        setError('Invalid profile ID');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('medical_profiles')
        .select('*')
        .eq('id', profileId)
        .eq('is_public', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Medical profile not found or not public');
        } else {
          setError('Failed to load medical profile');
        }
        setLoading(false);
        return;
      }

      setMedicalProfile(data);
    } catch (error: any) {
      console.error('Error fetching medical profile:', error);
      setError('An error occurred while loading the medical profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-8 h-8 text-medical-primary mx-auto mb-4 animate-pulse" />
          <div className="text-lg">Loading emergency medical information...</div>
        </div>
      </div>
    );
  }

  if (error || !medicalProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Medical Profile Not Found</h2>
            <p className="text-muted-foreground">
              {error || 'The requested medical profile could not be found or is not publicly accessible.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const callEmergencyContact = () => {
    window.location.href = `tel:${medicalProfile.emergency_contact_phone}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-medical-primary text-white py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Heart className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Emergency Medical Information</h1>
          </div>
          <p className="text-medical-light text-lg">
            Critical health information for emergency responders
          </p>
        </div>
      </header>

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
                    {medicalProfile.emergency_contact_name}
                  </p>
                  {medicalProfile.emergency_contact_relation && (
                    <p className="text-muted-foreground">
                      {medicalProfile.emergency_contact_relation}
                    </p>
                  )}
                  <p className="text-xl font-semibold text-medical-primary mt-2">
                    {medicalProfile.emergency_contact_phone}
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
                {medicalProfile.blood_group && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
                    <Badge variant="destructive" className="text-lg px-3 py-1">
                      {medicalProfile.blood_group}
                    </Badge>
                  </div>
                )}

                {medicalProfile.allergies && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Allergies</p>
                    <div className="bg-destructive/10 border border-destructive/20 rounded p-3 mt-1">
                      <p className="text-destructive font-medium">⚠️ ALLERGIC TO:</p>
                      <p className="whitespace-pre-wrap">{medicalProfile.allergies}</p>
                    </div>
                  </div>
                )}

                {medicalProfile.chronic_conditions && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Medical Conditions</p>
                    <p className="bg-muted p-3 rounded mt-1 whitespace-pre-wrap">
                      {medicalProfile.chronic_conditions}
                    </p>
                  </div>
                )}
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
                {medicalProfile.medications && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Medications</p>
                    <p className="bg-muted p-3 rounded mt-1 whitespace-pre-wrap">
                      {medicalProfile.medications}
                    </p>
                  </div>
                )}

                {medicalProfile.additional_notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
                    <p className="bg-muted p-3 rounded mt-1 whitespace-pre-wrap">
                      {medicalProfile.additional_notes}
                    </p>
                  </div>
                )}
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
        </div>
      </main>
    </div>
  );
};

export default EmergencyView;