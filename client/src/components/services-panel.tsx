
import React from 'react';
import { Button } from './ui/button';
import { useGoogleServices } from '@/hooks/use-google-services';

export function ServicesPanel() {
  const { status, isLoading, connectGoogle, disconnectAll } = useGoogleServices();

  return (
    <div className="space-y-4 p-4">
      <h3 className="font-semibold">Services connectés</h3>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span>Gmail</span>
          <Button
            variant={status.gmail ? "destructive" : "default"}
            onClick={status.gmail ? disconnectAll : connectGoogle}
            disabled={isLoading}
          >
            {isLoading ? "Chargement..." : status.gmail ? 'Déconnecter' : 'Connecter'}
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span>Google Calendar</span>
          <Button
            variant={status.calendar ? "destructive" : "default"}
            onClick={status.calendar ? disconnectAll : connectGoogle}
            disabled={isLoading}
          >
            {isLoading ? "Chargement..." : status.calendar ? 'Déconnecter' : 'Connecter'}
          </Button>
        </div>
      </div>
    </div>
  );
}
