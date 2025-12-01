import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

class Movie extends Model { }

Movie.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    duration_min: { type: DataTypes.INTEGER, allowNull: false },
    genre: { type: DataTypes.STRING(60), allowNull: true },
    rating: { type: DataTypes.FLOAT, allowNull: true },
    poster_url: { type: DataTypes.STRING(255), allowNull: true },
  },
  {
    sequelize,
    modelName: 'movie',
    tableName: 'movies',
    timestamps: true,
    underscored: true,
  }
);

export default Movie;