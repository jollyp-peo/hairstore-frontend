const StatCard = ({ icon: Icon, title, value }) => {
  return (
    <div className="p-4 bg-card rounded-xl shadow-card hover-lift transition-luxury">
      <div className="flex items-center gap-3">
        <Icon className="w-8 h-8 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
