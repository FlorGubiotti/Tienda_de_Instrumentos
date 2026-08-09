package com.example.TiendaDeMusica.services;

import com.example.TiendaDeMusica.entities.BaseEntity;
import com.example.TiendaDeMusica.repositories.BaseRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import java.io.Serializable;
import java.util.List;

public abstract class BaseServiceImpl<T extends BaseEntity, ID extends Serializable> implements BaseService<T, ID> {

    protected BaseRepository<T,ID> baseRepository;

    public BaseServiceImpl(BaseRepository<T, ID> baseRepository)
    {
        this.baseRepository = baseRepository;
    }

    @Override
    @Transactional
    public List<T> findAll() {
        return baseRepository.findAll();
    }

    @Override
    @Transactional
    public T findById(ID id) {
        return baseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No existe la entidad con id " + id));
    }

    @Override
    @Transactional
    public T save(T entity) {
        return baseRepository.save(entity);
    }

    @Override
    @Transactional
    public T update(T entity) {
        if (entity.getId() == null) {
            throw new IllegalArgumentException("La entidad a modificar debe contener un Id.");
        }
        findById((ID) entity.getId());
        return baseRepository.save(entity);
    }

    @Override
    @Transactional
    public boolean delete(ID id) {
        T entity = findById(id);
        baseRepository.delete(entity);
        return true;
    }

}
