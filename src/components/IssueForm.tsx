
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertCircle, ArrowRight, Upload, X, Check, MessageCircle, ArrowLeft } from 'lucide-react';
import EmergencyBanner from './EmergencyBanner';
import AIConversation from './AIConversation';

// List of emergency keywords to watch for
const EMERGENCY_KEYWORDS = ['gas', 'fire', 'flood', 'smoke', 'electrical', 'burst', 'leak'];

// Issue categories with troubleshooting guides
const ISSUE_CATEGORIES = [
  { id: 'washing-machine', name: 'Washing Machine Not Working', pdfUrl: '/guides/washing-machine.pdf', keywords: ['washing', 'machine', 'washer', 'laundry', 'clothes'] },
  { id: 'heating', name: 'Heating Issue', pdfUrl: '/guides/heating.pdf', keywords: ['heat', 'heating', 'cold', 'boiler', 'radiator', 'temperature'] },
  { id: 'plumbing', name: 'Plumbing Problem', pdfUrl: '/guides/plumbing.pdf', keywords: ['water', 'leak', 'tap', 'toilet', 'sink', 'drain', 'plumbing', 'pipe', 'drip'] },
  { id: 'electrical', name: 'Electrical Problem', pdfUrl: '/guides/electrical.pdf', keywords: ['light', 'power', 'socket', 'switch', 'electric', 'outlet', 'wire', 'circuit'] },
  { id: 'appliance', name: 'Other Appliance Issue', pdfUrl: '/guides/appliances.pdf', keywords: ['appliance', 'fridge', 'oven', 'stove', 'dishwasher', 'microwave', 'freezer'] },
  { id: 'other', name: 'Other Issue', pdfUrl: null, keywords: [] },
];

const IssueForm = () => {
  // Form steps
  const [step, setStep] = useState<'description' | 'ai-conversation' | 'details' | 'submitted'>('description');
  
  // Form data
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Emergency handling
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyType, setEmergencyType] = useState('');
  const [emergencyCallConfirmed, setEmergencyCallConfirmed] = useState(false);
  
  // AI conversation state
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);
  const [showTroubleshootingGuide, setShowTroubleshootingGuide] = useState(false);
  const [issueSolved, setIssueSolved] = useState(false);
  
  // Default emergency number - in a real app, this should be configurable
  const emergencyNumber = "911"; // This would be loaded from config/API
  
  // Check for emergency keywords in the description
  React.useEffect(() => {
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
  }, [description, isEmergency]);

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
      description,
      category: detectedCategory,
      name,
      email,
      phone,
      image: image?.name || 'No image'
    });

    setTimeout(() => {
      setStep('submitted');
    }, 1000);
  };

  // Detect category based on user's description
  const detectCategory = (text: string): string | null => {
    const lowercaseText = text.toLowerCase();
    
    for (const category of ISSUE_CATEGORIES) {
      if (category.keywords.some(keyword => lowercaseText.includes(keyword))) {
        return category.name;
      }
    }
    
    return null;
  };

  // Handle AI analysis of the problem description
  const handleAIAnalysis = () => {
    if (!description.trim()) {
      toast.error("Please describe your issue first");
      return;
    }
    
    setIsAIAnalyzing(true);
    
    // Add user message to conversation
    setConversationHistory(prev => [...prev, {
      role: 'user',
      content: description
    }]);
    
    // Detect category from description
    const category = detectCategory(description);
    if (category) {
      setDetectedCategory(category);
    }
    
    // Simulate AI response - in a real app, this would call an AI API
    setTimeout(() => {
      let response = "";
      
      if (isEmergency) {
        response = `I notice you mentioned ${emergencyType.toLowerCase()}. This is potentially dangerous and requires immediate attention. Please call the emergency number ${emergencyNumber} right away.`;
      } else if (category) {
        response = `I see you're having an issue with ${category.toLowerCase()}. Can you tell me more details about the problem you're experiencing?`;
        
        // Additional context based on detected category
        if (category.includes('Washing Machine')) {
          response += " Is the machine not turning on, making unusual noises, or leaking water?";
        } else if (category.includes('Heating')) {
          response += " Is your heating not working at all, or is it not reaching the desired temperature?";
        } else if (category.includes('Plumbing')) {
          response += " Can you tell me more about where exactly you're seeing water or leaking?";
        } else if (category.includes('Electrical')) {
          response += " Are you experiencing power outages, flickering lights, or problems with specific outlets?";
        }
      } else {
        response = "Thank you for reporting this issue. Could you provide more details about when you first noticed the problem and if it's getting worse?";
      }
      
      // Add AI response to conversation
      setConversationHistory(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
      
      setIsAIAnalyzing(false);
      setStep('ai-conversation');
    }, 1500);
  };

  // Handle user response to AI
  const handleUserResponse = (message: string) => {
    // Add user message to conversation
    setConversationHistory(prev => [...prev, {
      role: 'user',
      content: message
    }]);
    
    setIsAIAnalyzing(true);
    
    // If we haven't detected a category yet, try again with this message
    if (!detectedCategory) {
      const category = detectCategory(message);
      if (category) {
        setDetectedCategory(category);
      }
    }
    
    // Simulate AI response
    setTimeout(() => {
      let response = "";
      
      // Check for keywords about solutions or guides
      const lowercaseMsg = message.toLowerCase();
      if (lowercaseMsg.includes('solve') || lowercaseMsg.includes('fix') || lowercaseMsg.includes('guide') || 
          lowercaseMsg.includes('how to') || lowercaseMsg.includes('help me')) {
        
        if (detectedCategory) {
          response = `I have a troubleshooting guide for ${detectedCategory} that might help. Would you like to see it?`;
          // Show the troubleshooting guide
          setShowTroubleshootingGuide(true);
        } else {
          response = "I'd like to help you fix this. Could you tell me a bit more about what specific appliance or system is having issues?";
        }
      }
      // Check if they're asking about continuing to submission
      else if (lowercaseMsg.includes('submit') || lowercaseMsg.includes('report') || 
               lowercaseMsg.includes('done') || lowercaseMsg.includes('finish')) {
        response = "Would you like to proceed to submitting your issue report? You'll need to provide some contact details so we can follow up with you.";
      }
      // Check if they're confirming the issue is solved
      else if (lowercaseMsg.includes('solved') || lowercaseMsg.includes('fixed') || lowercaseMsg.includes('working now')) {
        response = "I'm glad to hear that! Is there anything else I can help you with, or would you like to end this session?";
        setIssueSolved(true);
      }
      // Default response with more follow-up questions
      else {
        if (detectedCategory) {
          if (detectedCategory.includes('Washing Machine')) {
            response = "Thank you for those details. It sounds like you might be experiencing a common issue with washing machines. Would you like to see some troubleshooting steps that could potentially solve your problem?";
          } else if (detectedCategory.includes('Heating')) {
            response = "I understand your heating system is causing problems. Before we proceed, have you checked if the thermostat is set correctly and if your radiators might need bleeding?";
          } else if (detectedCategory.includes('Plumbing')) {
            response = "Water issues can be concerning. Is the problem constant or intermittent? And have you tried turning off the water supply to the affected area?";
          } else if (detectedCategory.includes('Electrical')) {
            response = "Electrical problems should be handled carefully. Have you checked if any circuit breakers have tripped? Would you like to see some safe troubleshooting steps?";
          } else {
            response = "Thanks for providing that information. Would you like to see a troubleshooting guide that might help resolve your issue, or would you prefer to submit this report for professional assistance?";
          }
        } else {
          response = "I appreciate the additional information. Based on what you've shared, could you clarify which specific appliance or system is having issues? This will help me provide more targeted assistance.";
        }
      }
      
      // Add AI response to conversation
      setConversationHistory(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
      
      setIsAIAnalyzing(false);
    }, 1500);
  };

  // Handle proceeding to contact details
  const handleProceedToDetails = () => {
    setStep('details');
  };

  // Handle emergency call confirmation
  const handleEmergencyCallConfirmed = () => {
    setEmergencyCallConfirmed(true);
  };

  // Reset form to start over
  const handleStartOver = () => {
    setStep('description');
    setDescription('');
    setDetectedCategory(null);
    setName('');
    setEmail('');
    setPhone('');
    setImage(null);
    setImagePreview(null);
    setIsEmergency(false);
    setEmergencyType('');
    setEmergencyCallConfirmed(false);
    setConversationHistory([]);
    setShowTroubleshootingGuide(false);
    setIssueSolved(false);
  };

  // Go back to previous step
  const handleBack = () => {
    if (step === 'ai-conversation') {
      setStep('description');
    } else if (step === 'details') {
      setStep('ai-conversation');
    }
  };

  // Render the appropriate step
  const renderStep = () => {
    switch (step) {
      case 'description':
        return (
          <div className="step-container">
            <h2 className="text-xl font-medium mb-4">Describe your issue</h2>
            
            <div className="mb-4">
              <Label htmlFor="description">What's the problem?</Label>
              <Textarea
                id="description"
                placeholder="Please describe the issue you're experiencing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-32 mt-2"
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
                onClick={handleAIAnalysis}
                disabled={!description || (isEmergency && !emergencyCallConfirmed)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Get AI Assistance
              </Button>
            </div>
          </div>
        );
        
      case 'ai-conversation':
        return (
          <div className="step-container">
            <h2 className="text-xl font-medium mb-4">AI Assistance</h2>
            
            <AIConversation 
              conversation={conversationHistory}
              isLoading={isAIAnalyzing}
              onSendMessage={handleUserResponse}
              onBack={handleBack}
              selectedCategory={detectedCategory || undefined}
              showTroubleshootingGuide={showTroubleshootingGuide}
            />
            
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleProceedToDetails}
                className="flex items-center gap-2"
              >
                Continue to Submission <ArrowRight className="h-4 w-4" />
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
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
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
              {issueSolved
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
