import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Upload, X, CheckCircle, Music, Instagram, Globe, ArrowLeft } from 'lucide-react';
import { Badge } from './ui/badge';

interface ProfileCompletionProps {
  userType: 'artist' | 'host' | 'fan';
  onComplete: (userData: any) => void;
  onSkip: () => void;
}

interface UploadedImage {
  id: string;
  url: string;
  isProfile: boolean;
}

export function ProfileCompletion({ userType, onComplete, onSkip }: ProfileCompletionProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
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
            isProfile: uploadedImages.length === 0,
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
    onComplete({ ...formData, userType, images: uploadedImages, video: videoFile });
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case 'artist': return 'Artist';
      case 'host': return 'Host';
      case 'fan': return 'Fan';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-['Teko',sans-serif] text-3xl font-bold text-foreground">
              house<span className="text-primary">show</span>
            </h1>
            <Button 
              variant="ghost"
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground font-['Times',serif]"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="font-['Teko',sans-serif] text-5xl font-bold text-foreground mb-4">
            Complete Your {getUserTypeTitle()} Profile
          </h2>
          <p className="text-muted-foreground font-['Times',serif] text-lg">
            {userType === 'artist' && 'Let hosts know what makes your music special'}
            {userType === 'host' && 'Show artists what makes your venue unique'}
            {userType === 'fan' && 'Help us recommend the perfect shows for you'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Common Fields */}
            <div>
              <Label htmlFor="name" className="text-foreground mb-2 font-['Times',serif]">
                Your Name <span className="text-primary">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                placeholder="John Doe"
              />
            </div>

            {/* Artist Specific Fields */}
            {userType === 'artist' && (
              <>
                <div>
                  <Label htmlFor="bandName" className="text-foreground mb-2 font-['Times',serif]">
                    Band/Artist Name <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="bandName"
                    type="text"
                    required
                    value={formData.bandName}
                    onChange={(e) => setFormData({ ...formData, bandName: e.target.value })}
                    className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                    placeholder="The Violet Echoes"
                  />
                </div>

                <div>
                  <Label htmlFor="hometown" className="text-foreground mb-2 font-['Times',serif]">
                    Hometown <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="hometown"
                    type="text"
                    required
                    value={formData.hometown}
                    onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                    className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                    placeholder="Brooklyn, NY"
                  />
                </div>

                <div>
                  <Label htmlFor="genres" className="text-foreground mb-2 font-['Times',serif]">
                    Genres (comma separated) <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="genres"
                    type="text"
                    required
                    value={formData.genres}
                    onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                    className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                    placeholder="Indie Rock, Dream Pop, Alternative"
                  />
                </div>

                <div>
                  <Label htmlFor="bio" className="text-foreground mb-2 font-['Times',serif]">
                    Bio <span className="text-primary">*</span>
                  </Label>
                  <Textarea
                    id="bio"
                    required
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="bg-background border-border text-foreground rounded-sm focus:border-primary resize-none font-['Times',serif]"
                    placeholder="Tell us about your music..."
                    rows={4}
                  />
                </div>

                {/* Photos */}
                <div>
                  <Label className="text-foreground mb-2 font-['Times',serif]">
                    Photos <span className="text-primary">*</span> {uploadedImages.length > 0 && `(${uploadedImages.length})`}
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3 font-['Times',serif]">
                    Upload photos. First photo becomes your profile picture.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {uploadedImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img 
                          src={img.url} 
                          alt="Upload" 
                          className="w-full h-32 object-cover rounded-sm border-2 border-border"
                        />
                        {img.isProfile && (
                          <Badge className="absolute top-2 left-2 bg-primary text-foreground">
                            Profile
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm flex items-center justify-center gap-2">
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

                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-sm cursor-pointer bg-background hover:bg-card transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground font-['Times',serif]">
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

                {/* Video */}
                <div>
                  <Label className="text-foreground mb-2 font-['Times',serif]">
                    {getVideoLabel()} <span className="text-primary">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3 font-['Times',serif]">
                    {getVideoDescription()}
                  </p>
                  
                  {videoFile ? (
                    <div className="flex items-center gap-3 p-4 bg-background rounded-sm border border-border">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground font-['Times',serif]">{videoFile.name}</p>
                        <p className="text-xs text-muted-foreground font-['Times',serif]">
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
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-sm cursor-pointer bg-background hover:bg-card transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground font-['Times',serif]">
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

                {/* Social Links */}
                <div className="border-t border-border pt-6">
                  <h3 className="font-['Teko',sans-serif] text-2xl font-bold text-foreground mb-4">
                    Social Media & Streaming
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="spotifyLink" className="text-foreground mb-2 flex items-center gap-2 font-['Times',serif]">
                        <Music className="w-4 h-4" />
                        Spotify Link <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="spotifyLink"
                        type="url"
                        required
                        value={formData.spotifyLink}
                        onChange={(e) => setFormData({ ...formData, spotifyLink: e.target.value })}
                        className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                        placeholder="https://open.spotify.com/artist/..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="instagramLink" className="text-foreground mb-2 flex items-center gap-2 font-['Times',serif]">
                        <Instagram className="w-4 h-4" />
                        Instagram <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="instagramLink"
                        type="url"
                        required
                        value={formData.instagramLink}
                        onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })}
                        className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                        placeholder="https://instagram.com/..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="appleMusicLink" className="text-foreground mb-2 flex items-center gap-2 font-['Times',serif]">
                        <Music className="w-4 h-4" />
                        Apple Music Link
                      </Label>
                      <Input
                        id="appleMusicLink"
                        type="url"
                        value={formData.appleMusicLink}
                        onChange={(e) => setFormData({ ...formData, appleMusicLink: e.target.value })}
                        className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                        placeholder="https://music.apple.com/artist/..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="websiteLink" className="text-foreground mb-2 flex items-center gap-2 font-['Times',serif]">
                        <Globe className="w-4 h-4" />
                        Website
                      </Label>
                      <Input
                        id="websiteLink"
                        type="url"
                        value={formData.websiteLink}
                        onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                        className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                        placeholder="https://yourband.com"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Host Specific Fields */}
            {userType === 'host' && (
              <>
                <div>
                  <Label htmlFor="venueName" className="text-foreground mb-2 font-['Times',serif]">
                    Venue Name <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="venueName"
                    type="text"
                    required
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                    placeholder="Williamsburg Loft"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="neighborhood" className="text-foreground mb-2 font-['Times',serif]">
                      Neighborhood <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="neighborhood"
                      type="text"
                      required
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                      placeholder="Williamsburg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-foreground mb-2 font-['Times',serif]">
                      City <span className="text-primary">*</span>
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                      placeholder="Brooklyn, NY"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="capacity" className="text-foreground mb-2 font-['Times',serif]">
                    Venue Capacity <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                    placeholder="50"
                  />
                </div>

                <div>
                  <Label htmlFor="venueDescription" className="text-foreground mb-2 font-['Times',serif]">
                    Venue Description <span className="text-primary">*</span>
                  </Label>
                  <Textarea
                    id="venueDescription"
                    required
                    value={formData.venueDescription}
                    onChange={(e) => setFormData({ ...formData, venueDescription: e.target.value })}
                    className="bg-background border-border text-foreground rounded-sm focus:border-primary resize-none font-['Times',serif]"
                    placeholder="Describe your space..."
                    rows={4}
                  />
                </div>

                {/* Photos */}
                <div>
                  <Label className="text-foreground mb-2 font-['Times',serif]">
                    Venue Photos <span className="text-primary">*</span> {uploadedImages.length > 0 && `(${uploadedImages.length})`}
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3 font-['Times',serif]">
                    Upload photos of your space.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {uploadedImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img 
                          src={img.url} 
                          alt="Upload" 
                          className="w-full h-32 object-cover rounded-sm border-2 border-border"
                        />
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm flex items-center justify-center gap-2">
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

                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-sm cursor-pointer bg-background hover:bg-card transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground font-['Times',serif]">
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

                {/* Video */}
                <div>
                  <Label className="text-foreground mb-2 font-['Times',serif]">
                    {getVideoLabel()} <span className="text-primary">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3 font-['Times',serif]">
                    {getVideoDescription()}
                  </p>
                  
                  {videoFile ? (
                    <div className="flex items-center gap-3 p-4 bg-background rounded-sm border border-border">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground font-['Times',serif]">{videoFile.name}</p>
                        <p className="text-xs text-muted-foreground font-['Times',serif]">
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
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-sm cursor-pointer bg-background hover:bg-card transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground font-['Times',serif]">
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
              </>
            )}

            {/* Fan Specific Fields */}
            {userType === 'fan' && (
              <>
                <div>
                  <Label htmlFor="favoriteGenres" className="text-foreground mb-2 font-['Times',serif]">
                    Favorite Genres (comma separated) <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="favoriteGenres"
                    type="text"
                    required
                    value={formData.favoriteGenres}
                    onChange={(e) => setFormData({ ...formData, favoriteGenres: e.target.value })}
                    className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                    placeholder="Indie Rock, Jazz, Electronic"
                  />
                </div>

                <div>
                  <Label htmlFor="favoriteArtists" className="text-foreground mb-2 font-['Times',serif]">
                    Favorite Artists (comma separated)
                  </Label>
                  <Input
                    id="favoriteArtists"
                    type="text"
                    value={formData.favoriteArtists}
                    onChange={(e) => setFormData({ ...formData, favoriteArtists: e.target.value })}
                    className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                    placeholder="Radiohead, Tame Impala, The National"
                  />
                </div>

                <div>
                  <Label htmlFor="userCity" className="text-foreground mb-2 font-['Times',serif]">
                    City <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="userCity"
                    type="text"
                    required
                    value={formData.userCity}
                    onChange={(e) => setFormData({ ...formData, userCity: e.target.value })}
                    className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                    placeholder="Brooklyn, NY"
                  />
                </div>

                <div>
                  <Label htmlFor="university" className="text-foreground mb-2 font-['Times',serif]">
                    University (Optional)
                  </Label>
                  <Input
                    id="university"
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="bg-background border-border text-foreground rounded-sm focus:border-primary font-['Times',serif]"
                    placeholder="NYU"
                  />
                </div>

                <div>
                  <Label className="text-foreground mb-2 font-['Times',serif]">
                    Connect Spotify Account (Optional)
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-border text-foreground hover:bg-card"
                  >
                    <Music className="w-4 h-4" />
                    Connect Spotify
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 font-['Times',serif]">
                    We'll import your favorite artists and genres
                  </p>
                </div>
              </>
            )}

            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-['Teko',sans-serif] text-xl py-6 rounded-sm transition-all duration-200"
            >
              Complete Profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
