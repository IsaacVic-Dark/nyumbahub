return [
    'id' => $this->id,
    'code' => $this->code,
    'name' => $this->name,
    'slug' => $this->slug,
    'latitude' => $this->latitude,
    'longitude' => $this->longitude,
    'towns_count' => $this->whenCounted('towns'),
    'created_at' => $this->created_at,
    'updated_at' => $this->updated_at,
    'deleted_at' => $this->deleted_at,
];