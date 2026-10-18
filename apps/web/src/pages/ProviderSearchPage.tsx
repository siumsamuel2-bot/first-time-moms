import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type MatchedProvider, referralApi } from '@/lib/api';
import { MapPin, Search, Shield, Truck, UserCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const Badge = ({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'outline';
  className?: string;
}) => {
  const variants = {
    default: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    outline: 'border border-gray-300 bg-transparent',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className ?? ''}`}
    >
      {children}
    </span>
  );
};

const ScoreBadge = ({ score }: { score: number }) => {
  const variant =
    score >= 80 ? 'success' : score >= 60 ? 'default' : score >= 40 ? 'warning' : 'secondary';
  return (
    <Badge variant={variant} className="font-semibold">
      {score}% Match
    </Badge>
  );
};

export function ProviderSearchPage() {
  const [providers, setProviders] = useState<MatchedProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: '',
    insurance: '',
    lat: '',
    lng: '',
  });
  const [error, setError] = useState<string | null>(null);

  const specialties = [
    { value: 'ALL', label: 'All Specialties' },
    { value: 'PERINATAL_MH', label: 'Perinatal Mental Health' },
    { value: 'LACTATION', label: 'Lactation Consultant' },
    { value: 'PELVIC_FLOOR', label: 'Pelvic Floor Therapy' },
    { value: 'OBGYN', label: 'OB-GYN' },
    { value: 'MIDWIFE', label: 'Midwife' },
    { value: 'DOULA', label: 'Doula' },
    { value: 'PSYCHIATRY', label: 'Psychiatry' },
    { value: 'THERAPY', label: 'Therapy' },
  ];

  const loadProviders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.lat) params.append('lat', filters.lat);
      if (filters.lng) params.append('lng', filters.lng);
      if (filters.specialty && filters.specialty !== 'ALL')
        params.append('specialty', filters.specialty);
      if (filters.insurance) params.append('insurance', filters.insurance);

      const data = await referralApi.searchProviders(params.toString());
      setProviders(data);
    } catch (err) {
      console.error('Failed to load providers:', err);
      setError('Failed to load providers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters.specialty, filters.insurance, filters.lat, filters.lng]);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleFilterChange('lat', position.coords.latitude.toString());
        handleFilterChange('lng', position.coords.longitude.toString());
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Unable to retrieve your location');
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse max-w-md" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64">
              <CardContent className="pt-6">
                <div className="h-6 bg-muted rounded animate-pulse w-3/4 mb-4" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Find a Provider</h1>
        <p className="text-muted-foreground">
          Search for screened providers matched to your recovery needs
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select
                value={filters.specialty}
                onValueChange={(v) => handleFilterChange('specialty', v)}
              >
                <SelectTrigger id="specialty">
                  <SelectValue placeholder="All Specialties" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance</Label>
              <Input
                id="insurance"
                placeholder="e.g., Blue Cross, Aetna"
                value={filters.insurance}
                onChange={(e) => handleFilterChange('insurance', e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Location</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Latitude"
                  value={filters.lat}
                  onChange={(e) => handleFilterChange('lat', e.target.value)}
                  readOnly
                />
                <Input
                  placeholder="Longitude"
                  value={filters.lng}
                  onChange={(e) => handleFilterChange('lng', e.target.value)}
                  readOnly
                />
                <Button variant="outline" onClick={handleGeolocation} className="whitespace-nowrap">
                  <MapPin className="mr-2 h-4 w-4" />
                  Use My Location
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>
      )}

      {providers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No providers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search without location to see all available providers.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Found {providers.length} provider{providers.length !== 1 ? 's' : ''} matched to your
            profile
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((matched) => (
              <Card key={matched.provider.id} className="border-2 border-primary-100">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{matched.provider.name}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">
                        {matched.provider.specialties.join(', ').replace(/_/g, ' ')}
                      </p>
                    </div>
                    <ScoreBadge score={matched.score} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{matched.provider.location.address}</span>
                    <span className="text-gray-400">•</span>
                    <span>
                      {Math.round(
                        (() => {
                          const R = 3959;
                          const dLat =
                            ((matched.provider.location.lat - (Number(filters.lat) || 0)) *
                              Math.PI) /
                            180;
                          const dLng =
                            ((matched.provider.location.lng - (Number(filters.lng) || 0)) *
                              Math.PI) /
                            180;
                          const a =
                            Math.sin(dLat / 2) ** 2 +
                            Math.cos(((Number(filters.lat) || 0) * Math.PI) / 180) *
                              Math.cos((matched.provider.location.lat * Math.PI) / 180) *
                              Math.sin(dLng / 2) ** 2;
                          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        })()
                      )}{' '}
                      miles away
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {matched.reasons.map((reason: string) => (
                      <Badge key={reason} variant="outline" className="text-xs">
                        {reason}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5" />
                      <span>Screened & Approved</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      <span>Available in {matched.provider.availability.nextSlotDays} day(s)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>{matched.provider.insuranceAccepted.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      window.location.href = `tel:${matched.provider.contactInfo.phone}`;
                    }}
                  >
                    <span className="mr-2">📞</span>
                    Call to Schedule
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
