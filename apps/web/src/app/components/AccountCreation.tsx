import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Upload, X, Music, Instagram, Globe } from 'lucide-react';
import { CITY_OPTIONS, neighborhoodsForCity } from '../data/locations';

interface AccountCreationProps {
  userType: 'artist' | 'host' | 'fan';
  onComplete: (userData: any) => void;
  onBack: () => void;
  mode?: 'create' | 'edit';
  initialData?: any;
}

interface UploadedImage {
  id: string;
  url: string;
  isProfile: boolean;
}

export function AccountCreation({ userType, onComplete, onBack, mode = 'create', initialData }: AccountCreationProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(() => {
    const images = initialData?.images ?? [];
    if (images.length > 0 && !images.some((img: UploadedImage) => img.isProfile)) {
      images[0].isProfile = true;
    }
    return images;
  });
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false);
  
  const [formData, setFormData] = useState({
    email: initialData?.email ?? '',
    name: initialData?.name ?? '',
    tagline: initialData?.tagline ?? '',
    // Artist specific
    bandName: initialData?.bandName ?? '',
    hometown: initialData?.hometown ?? '',
    genres: initialData?.genres ?? '',
    bio: initialData?.bio ?? '',
    spotifyLink: initialData?.spotifyLink ?? '',
    appleMusicLink: initialData?.appleMusicLink ?? '',
    instagramLink: initialData?.instagramLink ?? '',
    websiteLink: initialData?.websiteLink ?? '',
    // Host specific
    venueName: initialData?.venueName ?? '',
    neighborhood: initialData?.neighborhood ?? '',
    city: initialData?.city ?? '',
    capacity: initialData?.capacity ?? '',
    venueDescription: initialData?.venueDescription ?? '',
    venueType: initialData?.venueType ?? '',
    artistSleep: initialData?.artistSleep ?? false,
    sleepDetails: initialData?.sleepDetails ?? '',
    topGenres: initialData?.topGenres ?? '',
    amenities: initialData?.amenities ?? '',
  });

  const neighborhoodOptions = useMemo(
    () => neighborhoodsForCity(formData.city || formData.hometown),
    [formData.city, formData.hometown]
  );

  const MAX_PHOTOS = 4;
  const MAX_IMAGE_BYTES = 900_000;
  const MAX_IMAGE_DIMENSION = 1400;
  const IMAGE_QUALITY = 0.72;

  const estimateDataUrlBytes = (dataUrl: string) => {
    const base64 = dataUrl.split(',')[1] ?? '';
    return Math.floor((base64.length * 3) / 4);
  };

  const compressImage = async (file: File) => {
    const rawDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image.'));
      reader.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image.'));
      image.src = rawDataUrl;
    });

    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
    const targetWidth = Math.round(img.width * scale);
    const targetHeight = Math.round(img.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return rawDataUrl;

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    return canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
  };

  const appendImages = async (files: FileList) => {
    const remainingSlots = MAX_PHOTOS - uploadedImages.length;
    const candidates = Array.from(files).slice(0, Math.max(remainingSlots, 0));
    if (candidates.length === 0) {
      setImageError(`You can upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    setIsUploadingImages(true);
    setImageError(null);
    for (const file of candidates) {
      try {
        const compressed = await compressImage(file);
        const bytes = estimateDataUrlBytes(compressed);
        if (bytes > MAX_IMAGE_BYTES) {
          setImageError('One of your photos is too large. Try a smaller image.');
          continue;
        }
        const newImage: UploadedImage = {
          id: Math.random().toString(36).substr(2, 9),
          url: compressed,
          isProfile: false,
        };
        setUploadedImages((prev) => [
          ...prev,
          { ...newImage, isProfile: prev.length === 0 },
        ]);
      } catch (err) {
        setImageError(err instanceof Error ? err.message : 'Failed to upload image.');
      }
    }
    setIsUploadingImages(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      await appendImages(files);
    }
  };

  const handlePhotoDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDraggingPhotos(false);
    const files = e.dataTransfer.files;
    if (files) {
      await appendImages(files);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((userType === 'artist' || userType === 'host') && step === 1) {
      setStep(2);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onComplete({ ...formData, userType, images: uploadedImages });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to save your profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case 'artist': return 'Artist';
      case 'host': return 'Host';
      case 'fan': return 'Music Lover';
    }
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
            {mode === 'edit' ? `Edit Your ${getUserTypeTitle()} Profile` : `Create Your ${getUserTypeTitle()} Account`}
          </h1>
          <p className="text-muted-foreground">
            {step === 1 ? 'Basic Information' : 'Media & Links'}
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
            {userType !== 'fan' && (
              <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        </div>

        <Card className="p-8 border-border shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                {/* Common Fields */}
                {userType !== 'fan' && (
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
                      placeholder="Full name"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="email" className="text-foreground mb-2">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required={mode === 'create'}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-input-background border-border"
                    placeholder="you@example.com"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    We’ll only verify your email later if you’re hosting, inviting, or ticketing.
                  </p>
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
                        placeholder="Band or artist name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hometown" className="text-foreground mb-2">
                        Hometown
                      </Label>
                      <select
                        id="hometown"
                        required
                        value={formData.hometown}
                        onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                        className="w-full bg-input-background border border-border rounded-md px-3 py-2"
                      >
                        <option value="">Select a city</option>
                        {CITY_OPTIONS.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
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
                        placeholder="Add genres"
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
                        placeholder="Share your sound and story."
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
                        placeholder="Venue name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="neighborhood" className="text-foreground mb-2">
                          Neighborhood
                        </Label>
                        <select
                          id="neighborhood"
                          required
                          value={formData.neighborhood}
                          onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                          className="w-full bg-input-background border border-border rounded-md px-3 py-2"
                        >
                          <option value="">Select a neighborhood</option>
                          {neighborhoodOptions.map((neighborhood) => (
                            <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="city" className="text-foreground mb-2">
                          City
                        </Label>
                        <select
                          id="city"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value, neighborhood: '' })}
                          className="w-full bg-input-background border border-border rounded-md px-3 py-2"
                        >
                          <option value="">Select a city</option>
                          {CITY_OPTIONS.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
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
                        placeholder="Approx. capacity"
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
                        placeholder="Describe your space, setup, and any house rules."
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
                    Upload up to 4 photos. Mark one as your profile picture.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {uploadedImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img 
                          src={img.url} 
                          alt="Upload" 
                          className="w-full h-32 object-cover rounded-lg border-2 border-border"
                        />
                        <label className="absolute top-2 left-2 flex items-center gap-2 text-xs bg-card/90 border border-border rounded px-2 py-1">
                          <input
                            type="checkbox"
                            checked={img.isProfile}
                            onChange={() => setProfileImage(img.id)}
                          />
                          <span>Profile</span>
                        </label>
                        <div className="absolute inset-0 bg-card/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
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

                  <label
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isDraggingPhotos ? 'border-primary bg-primary/10' : 'border-border bg-secondary/20 hover:bg-secondary/40'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingPhotos(true);
                    }}
                    onDragLeave={() => setIsDraggingPhotos(false)}
                    onDrop={handlePhotoDrop}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload photos or drag & drop
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
                  {isUploadingImages ? (
                    <p className="text-xs text-muted-foreground mt-2">Processing images...</p>
                  ) : null}
                  {imageError ? (
                    <p className="text-xs text-destructive mt-2">{imageError}</p>
                  ) : null}
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

            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6"
              disabled={isSubmitting}
            >
              {mode === 'edit'
                ? 'Save Changes'
                : userType === 'fan'
                  ? 'Create Account'
                  : step === 1
                    ? 'Continue'
                    : 'Create Account'}
            </Button>
            {submitError ? (
              <p className="text-sm text-destructive text-center">{submitError}</p>
            ) : null}
          </form>
        </Card>
      </div>
    </div>
  );
}
