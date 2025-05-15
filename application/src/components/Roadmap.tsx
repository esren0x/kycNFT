import { FaUserShield, FaCoins } from "react-icons/fa";
import { IconType } from "react-icons";
import { FaWallet } from "react-icons/fa";

const RoadmapItem = ({
  icon: Icon,
  title,
  description,
  quarter,
  isLast,
}: {
  icon: IconType;
  title: string;
  description: string;
  quarter: string;
  isLast: boolean;
}) => (
  <div className="relative flex items-start">
    {/* Timeline Line */}
    {!isLast && (
      <div className="absolute left-[34px] top-0 w-1 h-full bg-gradient-to-b from-primary-300 to-primary-100"></div>
    )}

    {/* Timeline Marker and Date */}
    <div className="relative">
      <div className="flex flex-col items-center mr-8">
        <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center z-10 shadow-lg border-4 border-white">
          <Icon className="w-7 h-7 text-primary-600" />
        </div>
        <div className="mt-2 text-sm font-semibold text-primary-600 bg-white px-2 z-10 font-abcd">
          {quarter}
        </div>
      </div>
    </div>

    {/* Content Card */}
    <div className="flex-1 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 mb-12">
      <h3 className="text-xl font-innovator font-semibold mb-2 text-gray-900">
        {title}
      </h3>
      <p className="text-gray-600 font-abcd">{description}</p>
    </div>
  </div>
);

export default function Roadmap() {
  const roadmapItems = [
    {
      icon: FaUserShield,
      title: "Multi-Provider KYC Network",
      description:
        "Expanding our network of trusted KYC providers to enhance decentralization. Currently we're using Sumsub sandbox environment for testing. We've pending applications to use Onfido and Veriff.",
      quarter: "Q3 2025",
    },
    {
      icon: FaWallet,
      title: "dApp and Wallet partnerships",
      description:
        "Our simple “Verification” API could be used on multiple Aleo dApps and Wallets. It increases security and allow an easy way to identify Verified users across the Aleo ecosystem",
      quarter: "Q4 2025",
    },
    {
      icon: FaCoins,
      title: "Sustainable Economics",
      description:
        "Developing a robust tokenomics to ensure long-term sustainability while keeping services accessible to all users since KYC providers are not free.",
      quarter: "Q1 2026",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-innovator font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
              Our Roadmap
            </h2>
            <p className="mt-4 text-gray-600 text-lg font-abcd">
              Building the future of decentralized identity verification
            </p>
          </div>

          <div className="pl-4">
            {roadmapItems.map((item, index) => (
              <RoadmapItem
                key={index}
                icon={item.icon}
                title={item.title}
                description={item.description}
                quarter={item.quarter}
                isLast={index === roadmapItems.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
