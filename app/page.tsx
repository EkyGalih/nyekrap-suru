import { Metadata } from 'next';
import DomainRedirectClient from '@/components/DomainRedirectClient';

const SETTINGS = {
  newDomain: "tamanto.web.id",
  oldDomain: "mytools.web.id",
  delay: 5 // Jeda dalam detik
};

export const metadata: Metadata = {
  title: 'Pindah ke Domain Baru - Tamanto',
  description: `Domain ${SETTINGS.oldDomain} telah berpindah ke ${SETTINGS.newDomain}.`,
  // Lapis 1: Pengalihan otomatis via HTML Head (Paling Cepat)
  other: {
    "refresh": `${SETTINGS.delay}; url=https://${SETTINGS.newDomain}`
  }
};

export default function Page() {
  return (
    <DomainRedirectClient
      newDomain={SETTINGS.newDomain}
      oldDomain={SETTINGS.oldDomain}
      delay={SETTINGS.delay}
    />
  );
}