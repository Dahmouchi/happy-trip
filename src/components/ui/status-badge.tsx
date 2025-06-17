import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
    case "confirmé":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
    case "en attente":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "canceled":
    case "cancelled":
    case "annulé":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
    case "confirmé":
      return <CheckCircle className="w-4 h-4" />;
    case "pending":
    case "en attente":
      return <Clock className="w-4 h-4" />;
    case "canceled":
    case "cancelled":
    case "annulé":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
    case "confirmé":
      return "Confirmée";
    case "pending":
    case "en attente":
      return "En attente";
    case "canceled":
    case "cancelled":
    case "annulé":
      return "Annulée";
    default:
      return "Inconnu";
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(
        status
      )}`}
    >
      {getStatusIcon(status)}
      {getStatusLabel(status)}
    </span>
  );
};
