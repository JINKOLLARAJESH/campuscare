import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Input';
import { Download, QrCode, ExternalLink, MapPin, Building, Printer } from 'lucide-react';
import { INITIAL_LOCATIONS } from '../../lib/mockData';
import { useNavigate } from 'react-router-dom';

export interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLocation?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  defaultLocation,
}) => {
  const navigate = useNavigate();
  const [selectedLoc, setSelectedLoc] = useState(
    defaultLocation || INITIAL_LOCATIONS[0].name
  );

  const locObj =
    INITIAL_LOCATIONS.find((l) => l.name === selectedLoc) || INITIAL_LOCATIONS[0];

  // Construct target URL
  const targetUrl = `${window.location.origin}/submit?location=${encodeURIComponent(
    locObj.name
  )}&building=${encodeURIComponent(locObj.building)}`;

  const handleLaunchReporting = () => {
    onClose();
    navigate(`/submit?location=${encodeURIComponent(locObj.name)}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Campus QR Grievance Beacon"
      description="Instant location-tagged anonymous complaint reporting"
      size="md"
    >
      <div className="space-y-4 text-center">
        {/* Location Selector */}
        <div className="text-left">
          <Select
            label="Select Campus Facility / Location"
            value={selectedLoc}
            onChange={(e) => setSelectedLoc(e.target.value)}
          >
            {INITIAL_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.name} — {loc.building} ({loc.zone})
              </option>
            ))}
          </Select>
        </div>

        {/* QR Display Card */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 inline-block shadow-inner">
          <div className="p-3 bg-white rounded-xl shadow-sm inline-block">
            <QRCodeSVG
              id="campus-qr-svg"
              value={targetUrl}
              size={180}
              level="H"
              includeMargin
            />
          </div>
          <div className="mt-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-royal-600" />
              {locObj.name}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mt-0.5">
              <Building className="w-3 h-3 text-slate-400" />
              {locObj.building} • {locObj.zone}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          Students who scan this QR code with any mobile camera will immediately open the grievance form with this location and zone automatically pre-selected.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Print Poster
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleLaunchReporting}
            leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Test Pre-filled Submission
          </Button>
        </div>
      </div>
    </Modal>
  );
};
