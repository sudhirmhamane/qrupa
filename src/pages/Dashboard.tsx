import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Heart, LogOut, User, FileText, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

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
  qr_code_url: string | null;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [medicalProfile, setMedicalProfile] = useState<MedicalProfile | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchMedicalProfile();
  }, [user, navigate]);

  const fetchMedicalProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setMedicalProfile(data);
        if (data.id) {
          generateQRCode(data.id);
        }
      }
    } catch (error: any) {
      console.error('Error fetching medical profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load medical profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (profileId: string) => {
    try {
      const emergencyUrl = `${window.location.origin}/emergency/${profileId}`;
      const qrDataUrl = await QRCode.toDataURL(emergencyUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#dc2626',
          light: '#ffffff'
        }
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-medical-primary" />
              <h1 className="text-xl font-bold text-medical-dark">MedLink Dashboard</h1>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              
              {medicalProfile ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Emergency Contact</p>
                    <p className="font-medium">{medicalProfile.emergency_contact_name}</p>
                    <p className="text-sm">{medicalProfile.emergency_contact_phone}</p>
                  </div>
                  
                  {medicalProfile.blood_group && (
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Group</p>
                      <p className="font-medium">{medicalProfile.blood_group}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">No medical profile found</p>
                  <Button 
                    onClick={() => navigate('/profile/edit')}
                    variant="medical"
                  >
                    Create Medical Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Emergency QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {qrCodeDataUrl ? (
                <div className="space-y-4">
                  <img 
                    src={qrCodeDataUrl} 
                    alt="Emergency QR Code" 
                    className="mx-auto"
                  />
                  <p className="text-sm text-muted-foreground">
                    Share this QR code for emergency access to your medical information
                  </p>
                  <Button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = 'medlink-emergency-qr.png';
                      link.href = qrCodeDataUrl;
                      link.click();
                    }}
                    variant="outline"
                  >
                    Download QR Code
                  </Button>
                </div>
              ) : (
                <div className="py-8">
                  <p className="text-muted-foreground">
                    Create a medical profile to generate your emergency QR code
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button 
            onClick={() => navigate('/profile/edit')}
            variant="medical"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {medicalProfile ? 'Edit Medical Profile' : 'Create Medical Profile'}
          </Button>
          
          {medicalProfile && (
            <Button 
              onClick={() => navigate(`/emergency/${medicalProfile.id}`)}
              variant="outline"
            >
              Preview Emergency View
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;