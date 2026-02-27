import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Upload, X, Check, Music, Instagram, Globe, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface AccountCreationProps {
  userType: 'artist' | 'host' | 'fan';
  onComplete: (userData: any) => void;
  onBack: () => void;
}

interface UploadedImage {
  id: string;
  url: string;
  isProfile: boolean;
}

export function AccountCreation({ userType, onComplete, onBack }: AccountCreationProps) {
  const [step, setStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    // Artist specific
    bandName: '',
    hometown: '',
    genres: '',
    bio: '',
    spotifyLink: '',
    appleMusicLink: '',
    instagramLink: '',
    websiteLink: '',
    // Host specific
    venueName: '',
    neighborhood: '',
    city: '',
    capacity: '',
    venueDescription: '',
    // Fan specific
    favoriteGenres: '',
    favoriteArtists: '',
    userCity: '',
    university: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage: UploadedImage = {
            id: Math.random().toString(36).substr(2, 9),
            url: reader.result as string,
            isProfile: uploadedImages.length === 0, // First image is profile by default
          };
          setUploadedImages((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const setProfileImage = (id: string) => {
    setUploadedImages((prev) =>
      prev.map((img) => ({ ...img, isProfile: img.id === id }))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userType === 'fan' && step === 1) {
      setStep(2);
      return;
    }
    
    if ((userType === 'artist' || userType === 'host') && step === 1) {
      setStep(2);
      return;
    }
    
    onComplete({ ...formData, userType, images: uploadedImages, video: videoFile });
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case 'artist': return 'Artist';
      case 'host': return 'Host';
      case 'fan': return 'Music Lover';
    }
  };

  const getVideoLabel = () => {
    if (userType === 'artist') return 'Performance Video';
    if (userType === 'host') return 'Walking Tour Video';
    return 'Video';
  };

  const getVideoDescription = () => {
    if (userType === 'artist') return 'Upload a video of your live performance';
    if (userType === 'host') return 'Upload a walking tour of your venue space';
    return '';
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={step === 1 ? onBack : () => setStep(1)}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          ← back
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-foreground mb-2">
            Create Your {getUserTypeTitle()} Account
          </h1>
          <p className="text-muted-foreground">
            {step === 1 ? 'Basic Information' : userType === 'fan' ? 'Your Music Preferences' : 'Media & Links'}
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </div>

        <Card className="p-8 border-border shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                {/* Common Fields */}
                <div>
                  <Label htmlFor="name" className="text-foreground mb-2">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-input-background border-border"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-foreground mb-2">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-input-background border-border"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-foreground mb-2">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-input-background border-border"
                    placeholder="••••••••"
                  />
                </div>

                {/* Artist Specific Fields */}
                {userType === 'artist' && (
                  <>
                    <div>
                      <Label htmlFor="bandName" className="text-foreground mb-2">
                        Band/Artist Name
                      </Label>
                      <Input
                        id="bandName"
                        type="text"
                        required
                        value={formData.bandName}
                        onChange={(e) => setFormData({ ...formData, bandName: e.target.value })}
                        className="bg-input-background border-border"
                        placeholder="The Violet Echoes"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hometown" className="text-foreground mb-2">
                        Hometown
                      </Label>
                      <Input
                        id="hometown"
                        type="text"
                        required
                        value={formData.hometown}
                        onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                        className="bg-input-background border-border"
                        placeholder="Brooklyn, NY"
                      />
                    </div>

                    <div>
                      <Label htmlFor="genres" className="text-foreground mb-2">
                        Genres (comma separated)
                      </Label>
                      <Input
                        id="genres"
                        type="text"
                        required
                        value={formData.genres}
                        onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                        className="bg-input-background border-border"
                        placeholder="Indie Rock, Dream Pop, Alternative"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio" className="text-foreground mb-2">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        required
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="bg-input-background border-border resize-none"
                        placeholder="Tell us about your music..."
                        rows={4}
                      />
                    </div>
                  </>
                )}

                {/* Host Specific Fields */}
                {userType === 'host' && (
                  <>
                    <div>
                      <Label htmlFor="venueName" className="text-foreground mb-2">
                        Venue Name
                      </Label>
                      <Input
                        id="venueName"
                        type="text"
                        required
                        value={formData.venueName}
                        onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                        className="bg-input-background border-border"
                        placeholder="Williamsburg Loft"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="neighborhood" className="text-foreground mb-2">
                          Neighborhood
                        </Label>
                        <Input
                          id="neighborhood"
                          type="text"
                          required
                          value={formData.neighborhood}
                          onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                          className="bg-input-background border-border"
                          placeholder="Williamsburg"
                        />
                      </div>

                      <div>
                        <Label htmlFor="city" className="text-foreground mb-2">
                          City
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="bg-input-background border-border"
                          placeholder="Brooklyn, NY"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="capacity" className="text-foreground mb-2">
                        Venue Capacity
                      </Label>
                      <Input
                        id="capacity"
                        type="number"
                        required
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        className="bg-input-background border-border"
                        placeholder="50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="venueDescription" className="text-foreground mb-2">
                        Venue Description
                      </Label>
                      <Textarea
                        id="venueDescription"
                        required
                        value={formData.venueDescription}
                        onChange={(e) => setFormData({ ...formData, venueDescription: e.target.value })}
                        className="bg-input-background border-border resize-none"
                        placeholder="Describe your space..."
                        rows={4}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* Step 2: Media & Links for Artists/Hosts */}
            {step === 2 && (userType === 'artist' || userType === 'host') && (
              <>
                {/* Photo Upload */}
                <div>
                  <Label className="text-foreground mb-2">
                    Photos {uploadedImages.length > 0 && `(${uploadedImages.length})`}
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload photos. Mark one as your profile picture.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {uploadedImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img 
                          src={img.url} 
                          alt="Upload" 
                          className="w-full h-32 object-cover rounded-lg border-2 border-border"
                        />
                        {img.isProfile && (
                          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                            Profile
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-card/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          {!img.isProfile && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => setProfileImage(img.id)}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              Set Profile
                            </Button>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImage(img.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-secondary/20 hover:bg-secondary/40 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload photos
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {/* Video Upload */}
                <div>
                  <Label className="text-foreground mb-2">
                    {getVideoLabel()} <span className="text-primary">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    {getVideoDescription()}
                  </p>
                  
                  {videoFile ? (
                    <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg border border-border">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{videoFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setVideoFile(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-secondary/20 hover:bg-secondary/40 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload video
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="video/*"
                        required
                        onChange={handleVideoUpload}
                      />
                    </label>
                  )}
                </div>

                {/* Social Media & Streaming Links - Artists Only */}
                {userType === 'artist' && (
                  <>
                    <div className="border-t border-border pt-6">
                      <h3 className="font-bold text-foreground mb-4">Social Media & Streaming Platforms</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="spotifyLink" className="text-foreground mb-2 flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            Spotify Link <span className="text-primary">*</span>
                          </Label>
                          <Input
                            id="spotifyLink"
                            type="url"
                            required
                            value={formData.spotifyLink}
                            onChange={(e) => setFormData({ ...formData, spotifyLink: e.target.value })}
                            className="bg-input-background border-border"
                            placeholder="https://open.spotify.com/artist/..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="appleMusicLink" className="text-foreground mb-2 flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            Apple Music Link
                          </Label>
                          <Input
                            id="appleMusicLink"
                            type="url"
                            value={formData.appleMusicLink}
                            onChange={(e) => setFormData({ ...formData, appleMusicLink: e.target.value })}
                            className="bg-input-background border-border"
                            placeholder="https://music.apple.com/artist/..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="instagramLink" className="text-foreground mb-2 flex items-center gap-2">
                            <Instagram className="w-4 h-4" />
                            Instagram <span className="text-primary">*</span>
                          </Label>
                          <Input
                            id="instagramLink"
                            type="url"
                            required
                            value={formData.instagramLink}
                            onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })}
                            className="bg-input-background border-border"
                            placeholder="https://instagram.com/..."
                          />
                        </div>

                        <div>
                          <Label htmlFor="websiteLink" className="text-foreground mb-2 flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Website
                          </Label>
                          <Input
                            id="websiteLink"
                            type="url"
                            value={formData.websiteLink}
                            onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                            className="bg-input-background border-border"
                            placeholder="https://yourband.com"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Step 2: Preferences for Music Lovers */}
            {step === 2 && userType === 'fan' && (
              <>
                <div>
                  <Label htmlFor="favoriteGenres" className="text-foreground mb-2">
                    Favorite Genres (comma separated)
                  </Label>
                  <Input
                    id="favoriteGenres"
                    type="text"
                    required
                    value={formData.favoriteGenres}
                    onChange={(e) => setFormData({ ...formData, favoriteGenres: e.target.value })}
                    className="bg-input-background border-border"
                    placeholder="Indie Rock, Jazz, Electronic"
                  />
                </div>

                <div>
                  <Label htmlFor="favoriteArtists" className="text-foreground mb-2">
                    Favorite Artists (comma separated)
                  </Label>
                  <Input
                    id="favoriteArtists"
                    type="text"
                    required
                    value={formData.favoriteArtists}
                    onChange={(e) => setFormData({ ...formData, favoriteArtists: e.target.value })}
                    className="bg-input-background border-border"
                    placeholder="Radiohead, Tame Impala, The National"
                  />
                </div>

                <div>
                  <Label className="text-foreground mb-2">
                    Connect Spotify Account (Optional)
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-border"
                  >
                    <Music className="w-4 h-4" />
                    Connect Spotify
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    We'll import your favorite artists and genres
                  </p>
                </div>

                <div>
                  <Label htmlFor="userCity" className="text-foreground mb-2">
                    City
                  </Label>
                  <Input
                    id="userCity"
                    type="text"
                    required
                    value={formData.userCity}
                    onChange={(e) => setFormData({ ...formData, userCity: e.target.value })}
                    className="bg-input-background border-border"
                    placeholder="Brooklyn, NY"
                  />
                </div>

                <div>
                  <Label htmlFor="university" className="text-foreground mb-2">
                    University (Optional)
                  </Label>
                  <Input
                    id="university"
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="bg-input-background border-border"
                    placeholder="NYU"
                  />
                </div>
              </>
            )}

            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6"
            >
              {step === 1 ? 'Continue' : 'Create Account'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
