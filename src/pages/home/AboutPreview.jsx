import { Book, Users, Heart, ArrowRight } from "lucide-react";

const AboutPreview = () => {
  const features = [
    {
      icon: <Book className="h-8 w-8" />,
      title: "Biblical Foundation",
      description:
        "We strive to follow the New Testament pattern for worship and church organization, speaking where the Bible speaks.",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Global Community",
      description:
        "Connecting autonomous congregations worldwide who share a common faith and commitment to Biblical truth.",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Unity in Christ",
      description:
        "Promoting fellowship and cooperation among churches of Christ while maintaining local autonomy.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              About the Church of Christ
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              The Church of Christ is committed to following the New Testament
              pattern for the church. We believe in the authority of Scripture,
              the importance of baptism for the remission of sins, and simple, a
              cappella worship.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Our global directory helps members and seekers find faithful
              congregations around the world, fostering unity and facilitating
              fellowship across borders.
            </p>

            <a
              href="/about"
              className="inline-flex items-center bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold"
            >
              Learn More About Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg dark:shadow-gray-900/50 dark:hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
