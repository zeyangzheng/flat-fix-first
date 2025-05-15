
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { AlertCircle, ArrowRight, Upload, X, Check, Security, Heating } from 'lucide-react';
import EmergencyBanner from './EmergencyBanner';
import TroubleshootingGuide from './TroubleshootingGuide';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// List of emergency keywords to watch for
const EMERGENCY_KEYWORDS = ['gas', 'fire', 'flood', 'smoke', 'electrical', 'burst', 'leak'];

// Issue categories with troubleshooting guides
const ISSUE_CATEGORIES = [
  { id: 'washing-machine', name: 'Washing Machine Not Working', pdfUrl: '/guides/washing-machine.pdf' },
  { id: 'heating', name: 'Heating Issue', pdfUrl: '/guides/heating.pdf' },
  { id: 'plumbing', name: 'Plumbing Problem', pdfUrl: '/guides/plumbing.pdf' },
  { id: 'electrical', name: 'Electrical Problem', pdfUrl: '/guides/electrical.pdf' },
  { id: 'appliance', name: 'Other Appliance Issue', pdfUrl: '/guides/appliances.pdf' },
  { id: 'other', name: 'Other Issue', pdfUrl: null },
];

// Room options
const ROOM_OPTIONS = [
  'General',
  'Bathroom',
  'Kitchen',
  'Living Room',
  'Utility Room',
  'Dining Room',
  'Bedroom',
  'Guest Room',
  'Outdoor',
  'Communal',
  'Cellar',
  'Hallway',
  'Storage',
  'Attic',
];

// Problem categories from the screenshot
const PROBLEM_CATEGORIES = [
  { id: 'security', name: 'Security & Alarms', icon: 'Security' },
  { id: 'heating', name: 'Heating', icon: 'Heating' },
  { id: 'internet', name: 'Internet & Cable', icon: 'internet' },
  { id: 'floors', name: 'Floors, Walls & Ceiling', icon: 'floors' },
  { id: 'pests', name: 'Pests & Vermin', icon: 'pests' },
  { id: 'gas', name: 'Gas', icon: 'gas' },
  { id: 'detectors', name: 'Detectors & Meters', icon: 'detectors' },
  { id: 'water', name: 'Water & Plumbing', icon: 'water' },
  { id: 'air-conditioning', name: 'Air Conditioning', icon: 'air-conditioning' },
  { id: 'electricity', name: 'Electricity', icon: 'electricity' },
];

const IssueForm = () => {
  // Form steps
  const [step, setStep] = useState<'description' | 'category' | 'guide' | 'details' | 'submitted'>('description');
  
  // Form data
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [room, setRoom] = useState('General');
  const [problemCategory, setProblemCategory] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Emergency handling
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyType, setEmergencyType] = useState('');
  const [emergencyCallConfirmed, setEmergencyCallConfirmed] = useState(false);
  
  // Guide related state
  const [guideSolvedIssue, setGuideSolvedIssue] = useState<boolean | null>(null);
  const [hasReadAdvice, setHasReadAdvice] = useState(false);
  
  // Default emergency number - in a real app, this should be configurable
  const emergencyNumber = "911"; // This would be loaded from config/API
  
  // Check for emergency keywords in the description
  useEffect(() => {
    if (description) {
      const lowercaseDesc = description.toLowerCase();
      const foundKeyword = EMERGENCY_KEYWORDS.find(keyword => 
        lowercaseDesc.includes(keyword)
      );
      
      if (foundKeyword && !isEmergency) {
        setIsEmergency(true);
        setEmergencyType(foundKeyword.charAt(0).toUpperCase() + foundKeyword.slice(1));
      } else if (!foundKeyword && isEmergency) {
        setIsEmergency(false);
        setEmergencyCallConfirmed(false);
      }
    }
  }, [description]);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send data to your API
    toast.success("Issue submitted successfully!");
    
    // Simulate API call
    console.log("Submitting issue:", {
      room,
      problemCategory,
      description,
      category,
      name,
      email,
      phone,
      image: image?.name || 'No image',
      hasReadAdvice
    });

    setTimeout(() => {
      setStep('submitted');
    }, 1000);
  };

  // Handle proceeding to next step
  const handleNextStep = () => {
    if (step === 'description') {
      if (isEmergency && !emergencyCallConfirmed) {
        return; // Don't proceed until emergency call is confirmed
      }
      setStep('category');
    } else if (step === 'category') {
      const selectedCategory = ISSUE_CATEGORIES.find(c => c.id === category);
      if (selectedCategory && selectedCategory.pdfUrl) {
        setStep('guide');
      } else {
        setStep('details');
      }
    } else if (step === 'guide') {
      if (guideSolvedIssue === true) {
        setStep('submitted');
      } else {
        setStep('details');
      }
    }
  };

  // Handle emergency call confirmation
  const handleEmergencyCallConfirmed = () => {
    setEmergencyCallConfirmed(true);
  };

  // Reset form to start over
  const handleStartOver = () => {
    setStep('description');
    setDescription('');
    setCategory('');
    setRoom('General');
    setProblemCategory('');
    setName('');
    setEmail('');
    setPhone('');
    setImage(null);
    setImagePreview(null);
    setIsEmergency(false);
    setEmergencyType('');
    setEmergencyCallConfirmed(false);
    setGuideSolvedIssue(null);
    setHasReadAdvice(false);
  };

  // Render the appropriate step
  const renderStep = () => {
    switch (step) {
      case 'description':
        return (
          <div className="step-container">
            <h2 className="text-xl font-medium mb-4">Report an Issue</h2>
            
            <div className="mb-4">
              <Label htmlFor="room">Which room is this about?</Label>
              <Select value={room} onValueChange={(value) => setRoom(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_OPTIONS.map((roomOption) => (
                    <SelectItem key={roomOption} value={roomOption}>
                      {roomOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="problem-category">What's the problem?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {PROBLEM_CATEGORIES.map((problem) => (
                  <div
                    key={problem.id}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                      problemCategory === problem.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:bg-secondary'
                    }`}
                    onClick={() => setProblemCategory(problem.id)}
                  >
                    <div className="mr-2 text-primary">
                      {/* The icons would be rendered here if available */}
                    </div>
                    <span>{problem.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="description">Describe the issue</Label>
              <Textarea
                id="description"
                placeholder="Please describe what's happening in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-32"
              />
            </div>
            
            {isEmergency && (
              <EmergencyBanner 
                emergencyType={emergencyType} 
                emergencyNumber={emergencyNumber}
                onConfirmed={handleEmergencyCallConfirmed}
              />
            )}
            
            <div className="flex justify-end">
              <Button
                onClick={handleNextStep}
                disabled={!description || (isEmergency && !emergencyCallConfirmed) || !problemCategory}
                className="flex items-center gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 'category':
        return (
          <div className="step-container">
            <h2 className="text-xl font-medium mb-4">Select issue category</h2>
            <div className="grid gap-3 mb-6">
              {ISSUE_CATEGORIES.map((issueCategory) => (
                <div
                  key={issueCategory.id}
                  className={`border rounded-md p-3 cursor-pointer transition-colors ${
                    category === issueCategory.id ? 'border-primary bg-primary/5' : 'hover:bg-secondary'
                  }`}
                  onClick={() => setCategory(issueCategory.id)}
                >
                  {issueCategory.name}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('description')}>
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!category}
                className="flex items-center gap-2"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case 'guide':
        const selectedCategory = ISSUE_CATEGORIES.find(c => c.id === category);
        return (
          <div className="step-container">
            <h2 className="text-xl font-medium mb-4">Troubleshooting Guide</h2>
            
            <TroubleshootingGuide 
              category={selectedCategory?.name || ''} 
              pdfUrl={selectedCategory?.pdfUrl || ''}
            />
            
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-3">Did this solve your issue?</h3>
              
              <div className="flex gap-4">
                <Button 
                  onClick={() => setGuideSolvedIssue(true)} 
                  variant={guideSolvedIssue === true ? "default" : "outline"}
                  className="flex-1"
                >
                  Yes, it's fixed
                </Button>
                <Button 
                  onClick={() => setGuideSolvedIssue(false)}
                  variant={guideSolvedIssue === false ? "default" : "outline"} 
                  className="flex-1"
                >
                  No, I still need help
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                id="read-advice"
                checked={hasReadAdvice}
                onChange={() => setHasReadAdvice(!hasReadAdvice)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="read-advice" className="text-sm">
                I confirm that I have read the relevant advice provided
              </label>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => setStep('category')}>
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={guideSolvedIssue === null || !hasReadAdvice}
              >
                {guideSolvedIssue ? "Complete" : "Continue to submission"}
              </Button>
            </div>
          </div>
        );
        
      case 'details':
        return (
          <div className="step-container">
            <h2 className="text-xl font-medium mb-4">Your contact details</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="image">Upload Image (Optional)</Label>
                  <div className="mt-1">
                    {!imagePreview ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="outline" type="button" className="relative z-10">
                          Select Image
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mt-2 max-w-full h-auto rounded-md max-h-36 object-contain"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep('category')}
                >
                  Back
                </Button>
                <Button type="submit">Submit Report</Button>
              </div>
            </form>
          </div>
        );
        
      case 'submitted':
        return (
          <div className="step-container text-center py-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              {guideSolvedIssue
                ? "We're glad the troubleshooting guide solved your issue!"
                : "Your issue has been reported and we'll be in touch soon."}
            </p>
            <Button onClick={handleStartOver}>Report Another Issue</Button>
          </div>
        );
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        {renderStep()}
      </CardContent>
    </Card>
  );
};

export default IssueForm;
